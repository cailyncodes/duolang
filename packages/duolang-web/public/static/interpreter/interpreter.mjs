import { executor } from './executor/index.mjs';
import { lexer } from './lexer/index.mjs';
import { duolangParser, treeParser } from './parser/index.mjs';

export async function interpreter(duolangString, treeString) {
	const tree = treeParser(treeString);
	const program = duolangParser(duolangString);
	const [ast, jumpLabelMap] = lexer(program, tree);

	if (!ast) {
		throw new Error('AST could not be constructed');
	}

	const result = await executor(ast, jumpLabelMap);

	return result;
}

