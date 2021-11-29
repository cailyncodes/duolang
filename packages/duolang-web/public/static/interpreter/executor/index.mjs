import { Lexems } from '../lexer/index.mjs';
import { TYPE_PROCESSOR_MAP } from '../processors/index.mjs';

async function getIOInterfaces() {
	let input, output;

	if (typeof window === 'object') {
		if (!window.Duolang) {
			window.Duolang = {};
		}
		window.Duolang.OutputBuffer = [];
		input = {
			read: window.prompt.bind(this),
			close() {},
		}
		output = {
			log(val) {
				window.Duolang.OutputBuffer.push(val);
			}
		}
	} else {
		const [
			{ stdin, stdout },
			readline,
			{ default: util },
		] = await Promise.all([
			import('process'),
			import('readline'),
			import('util')
		]);

		const rl = readline.createInterface({ input: stdin, output: stdout });
		input = Object.create(rl);
		input.read = util.promisify(rl.question).bind(rl);
		output = console;
	}

	return [input, output];
}

export async function executor(ast, jumpLabelMap) {
	const [input, output] = await getIOInterfaces();
	let maxIterations = 3000;
	const stack = [];
	let currentValue = '';
	for (let i = 0; i < ast.length;) {
		if (maxIterations === 0) {
			const doContinue = await input.read('Warning! Your program probably has an infinite loop. Type "continue" to continue running. Anything else to exit: ')
			if (doContinue !== 'continue') {
				input.close();
				return;
			}
			maxIterations = 3000;
		}
		--maxIterations;

		const lexem = ast[i];
		++i;
		const lexemName = lexem[0];
		let left, right;
		let numberOfItemsFromStack = 1;
		let jumpDestination;
		switch (lexemName) {
			case Lexems.DATA_BOOLEAN:
			case Lexems.DATA_INTEGER:
			case Lexems.DATA_DECIMAL:
			case Lexems.DATA_ASCII:
			case Lexems.DATA_UTF8:
				const encodedData = lexem[1] || [];
				currentValue = encodedData.map(encoding => {
					if (encoding === '1') {
						return '01';
					}
					if (encoding === '2') {
						return '10';
					}
					if (encoding === '3') {
						return '11';
					}
					if (encoding === '4') {
						return '00';
					}
				}).join('') || "00000000";

				const value = TYPE_PROCESSOR_MAP[lexemName](currentValue);
				stack.push(value);
				currentValue = undefined;
				break;
			case Lexems.POP_STACK_AND_SAVE:
				currentValue = stack[stack.length - 1] || 0;
				// intentional fallthrough
			case Lexems.POP_STACK:
				stack.splice(stack.length - 1, 1);
				break;
			case Lexems.SWITCH_STACK_VALUES:
				left = stack[stack.length - 2];
				right = stack[stack.length - 1];
				if (left !== undefined && right !== undefined) {
					stack.splice(stack.length - 2, 2);
					stack.push(right);
					stack.push(left);
				}
				break;
			case Lexems.DUPLICATE:
				stack.push(stack[stack.length - 1] || 0);
				break;
			case Lexems.PUSH_STACK:
				currentValue !== undefined && stack.push(currentValue);
				currentValue = undefined;
				break;
			case Lexems.CONCAT_OR_ADD:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = stack[stack.length - 1] || 0;
					right = currentValue;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				// inherit JS '+' semantics for now
				stack.push(left + right)
				break;
			case Lexems.SUBTRACTION:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = stack[stack.length - 1] || 0;
					right = currentValue;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				if (typeof left === 'number' && typeof right === 'number') {
					stack.push(left - right);
				} else { /* noop */ }
				break;
			case Lexems.MULTIPLICATION:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = currentValue;
					right = stack[stack.length - 1] || 0;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				if (typeof left === 'number' && typeof right === 'number') {
					stack.push(left * right);
				} else { /* noop */ }
				break;
			case Lexems.DIVISION_INTEGER:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = currentValue;
					right = stack[stack.length - 1] || 0;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				if (typeof left === 'number' && typeof right === 'number') {
					// try to prevent division by zero --> Infinity issues
					stack.push(Math.floor(left / (right === 0 ? Math.pow(10, -100) : right)));
				} else { /* noop */ }
				break;
			case Lexems.BITWISE_XOR:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = currentValue;
					right = stack[stack.length - 1] || 0;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				if ((typeof left === 'boolean' && typeof right === 'boolean') || (typeof left === 'number' || typeof right === 'number')){
					stack.push(left ^ right);
				} else { /* noop */ }
				break;
			case Lexems.BITWISE_NAND:
				numberOfItemsFromStack = 1;
				if (currentValue) {
					left = currentValue;
					right = stack[stack.length - 1] || 0;
				} else {
					numberOfItemsFromStack = 2;
					left = stack[stack.length - 2] || 0;
					right = stack[stack.length - 1] || 0;
				}
				stack.splice(stack.length - numberOfItemsFromStack, numberOfItemsFromStack);
				if ((typeof left === 'boolean' && typeof right === 'boolean') || (typeof left === 'number' || typeof right === 'number')){
					stack.push(~(left & right));
				} else { /* noop */ }
				break;
			case Lexems.JUMP_ON_ZERO:
				jumpDestination = stack[stack.length - 1];
				if (typeof jumpDestination !== undefined && !currentValue) {
					stack.splice(stack.length - 1, 1);
					jumpLabelMap[jumpDestination] && (i = jumpLabelMap[jumpDestination]);
				}
				break;
			case Lexems.JUMP_NOT_ON_ZERO:
				jumpDestination = stack[stack.length - 1];
				if (typeof jumpDestination !== undefined && currentValue) {
					stack.splice(stack.length - 1, 1);
					jumpLabelMap[jumpDestination] && (i = jumpLabelMap[jumpDestination]);
				}
				break;
			case Lexems.READ_INPUT_INTEGER:
				const answerInt = await input.read('Input Integer: ');
				const processedAnswer = parseInt(answerInt, 10);
				stack.push(processedAnswer);
				break;
			case Lexems.READ_INPUT_ASCII_STRING:
				const answerStr = await input.read('Input ASCII String: ');
				stack.push(answerStr);
				break;
			case Lexems.PRINT:
				output.log(currentValue || stack[(stack.length - 1) || 0]);
				break;
		}
	}

	input.close();

	return currentValue || stack[(stack.length - 1) || 0];
}
