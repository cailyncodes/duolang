export const Context = {
	SKIP: 'skip',
	START_DATA: 'start-data',
	PROCESSING_DATA: 'processing-data',
	PROCESSING_LABEL: 'processing-label',
	ACTION: 'action',
}

export const CONTEXT_MAP = {
	0: Context.SKIP,
	1: Context.START_DATA,
	2: Context.ACTION,
}

export const Lexems = {
	PROGRAM_END: 'program-end',
	DATA_BOOLEAN: 'data-boolean',
	DATA_INTEGER: 'data-integer',
	DATA_DECIMAL: 'data-decimal',
	DATA_ASCII: 'data-ascii',
	CONTINUE_OR_PUSH_STACK: 'continue-or-push-stack',
	DATA_UTF8: 'data-utf8',
	POP_STACK: 'pop-stack',
	POP_STACK_AND_SAVE: 'pop-stack-and-save',
	SWITCH_STACK_VALUES: 'switch-stack-values',
	DUPLICATE: 'duplicate',
	PUSH_STACK: 'push-stack',
	CONCAT_OR_ADD: 'concat-or-add',
	SUBTRACTION: 'subtraction',
	MULTIPLICATION: 'multiplication',
	DIVISION_INTEGER: 'division-integer',
	DIVISION_FLOATING_POINT: 'division-floating-point',
	BITWISE_XOR: 'bitwise-xor',
	BITWISE_NAND: 'bitwise-nand',
	MARK_JUMP_LABEL: 'mark-jump-label',
	JUMP_ON_ZERO: 'jump-on-zero',
	JUMP_NOT_ON_ZERO: 'jump-not-on-zero',
	READ_INPUT_INTEGER: 'read-input-integer',
	READ_INPUT_ASCII_STRING: 'read-input-ascii-string',
	PRINT: 'print',
}

export const LEXEM_MAP = {
	'0': Lexems.PROGRAM_END,
	'1': Lexems.DATA_BOOLEAN,
	'2': Lexems.DATA_INTEGER,
	'3': Lexems.DATA_DECIMAL,
	'4': Lexems.DATA_ASCII,
	'5': Lexems.CONTINUE_OR_PUSH_STACK,
	'6': Lexems.DATA_UTF8,
	'11': Lexems.POP_STACK,
	'12': Lexems.POP_STACK_AND_SAVE,
	'13': Lexems.SWITCH_STACK_VALUES,
	'14': Lexems.DUPLICATE,
	'15': Lexems.PUSH_STACK,
	'21': Lexems.CONCAT_OR_ADD,
	'22': Lexems.SUBTRACTION,
	'23': Lexems.MULTIPLICATION,
	'24': Lexems.DIVISION_INTEGER,
	'31': Lexems.BITWISE_XOR,
	'32': Lexems.BITWISE_NAND,
	'33': Lexems.MARK_JUMP_LABEL,
	'34': Lexems.JUMP_ON_ZERO,
	'35': Lexems.JUMP_NOT_ON_ZERO,
	'42': Lexems.READ_INPUT_INTEGER,
	'44': Lexems.READ_INPUT_ASCII_STRING,
	'45': Lexems.PRINT,
}

export function lexer(program, tree) {
	const programLexemes = [];
	const jumpLabelMap = {};
	let remainingDuolangData = program;
	let currentContext = undefined;
	let index = 0;
	for (let lexemSize of tree) {
		let data = remainingDuolangData.substr(0, lexemSize);
		remainingDuolangData = remainingDuolangData.substr(lexemSize);

		// register the end of the program if encounter a 0
		if (data.includes(0)) {
			programLexemes.push([Lexems.PROGRAM_END]);
			return [programLexemes, jumpLabelMap];
		}

		if (!currentContext) {
			// trim any leading 5s when in an undefined context
			while (data.startsWith('5')) {
				data = data.substr(1);
				--lexemSize;
			}
			currentContext = CONTEXT_MAP[lexemSize];
		}

		switch (currentContext) {
			case Context.SKIP:
				currentContext = undefined;
				break;
			case Context.START_DATA:
				currentContext = Context.PROCESSING_DATA;
				programLexemes.push([LEXEM_MAP[data], []]);
				++index;
				break;
			case Context.PROCESSING_DATA:
			case Context.PROCESSING_LABEL:
				let datumPosition = 1;
				for (const datum of data) {
					if (datum === '5' && datumPosition === lexemSize) {
						if (currentContext === Context.PROCESSING_LABEL) {
							const labelData = programLexemes[programLexemes.length - 1][1];
							const label = labelData.join('');
							jumpLabelMap[label] = index;
						}
						currentContext = undefined;
					} else if (datum !== '5') {
						programLexemes[programLexemes.length - 1][1].push(datum)
					}
					++datumPosition;
				}
				break;
			case Context.ACTION:
				currentContext = undefined;
				const currentLexem = LEXEM_MAP[data];
				if (currentLexem) {
					// marking jump labels is an action, not a separate context
					// like starting a data declaration
					if (currentLexem === Lexems.MARK_JUMP_LABEL) {
						currentContext = Context.PROCESSING_LABEL;
						programLexemes.push([currentLexem, []]);
					} else {
						programLexemes.push([currentLexem]);
					}
				}
				++index;
				break;
		}
	}

	// automatically add program end lexem if we reach the end of the program/tree
	programLexemes.push([Lexems.PROGRAM_END]);
	return [programLexemes, jumpLabelMap];
}
