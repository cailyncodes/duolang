import AsciiBinaryConverter from './ascii-binary-converter.mjs';
import { Lexems } from '../lexer/index.mjs';

function processBoolean(encodedValue) {
	return encodedValue.split('').reduce((result, value) => result = result | parseInt(value, 2), 0);
}

export const TYPE_PROCESSOR_MAP = {
	[Lexems.DATA_BOOLEAN]: processBoolean,
	[Lexems.DATA_INTEGER]: (encodedValue) => parseInt(encodedValue, 2),
	// TODO: Implement floating point
	[Lexems.DATA_DECIMAL]: (encodedValue) => parseInt(encodedValue, 2),
	[Lexems.DATA_ASCII]: (encodedValue) => AsciiBinaryConverter.toAscii(encodedValue),
	[Lexems.DATA_UTF8]: (encodedValue) => AsciiBinaryConverter.toUTF8(encodedValue),
}
