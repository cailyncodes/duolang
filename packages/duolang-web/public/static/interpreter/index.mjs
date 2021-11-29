import fs from 'fs';
import path from 'path';
import { interpreter } from './interpreter.mjs';

async function main() {
	const [duolangFile, treeFile] = process.argv.slice(2);
	if (!duolangFile || !treeFile) {
		console.error('Must specify paths for both duolang file and tree structure file');
		return;
	}

	const treePath = path.join(process.cwd(), treeFile);
	const treeString = fs.readFileSync(treePath).toString();

	const duolangPath = path.join(process.cwd(), duolangFile);
	const duolangString = fs.readFileSync(duolangPath).toString();

	const result = await interpreter(duolangString, treeString);

	result && console.log(result);
}

void main();