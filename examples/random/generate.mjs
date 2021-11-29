import fs from 'fs';
import path from 'path';
import { interpreter } from '../../packages/duolang-web/public/static/interpreter/interpreter.mjs';

async function main(fileName) {
	const filePath = path.join(process.cwd(), fileName);

	const size = Math.floor(60 * Math.random() + 50);

	const data = [];

	for (let i = 0; i < size; ++i) {
		const datum = Math.floor(5 * Math.random() + 1);
		data.push(datum);
	}
	data.push('0')

	const dataStr = data.join('');

	fs.writeFileSync(filePath, dataStr);

	const treeString = fs.readFileSync(path.join('examples', 'random', 'spanish.tree').toString()).toString();
	const duolangString = fs.readFileSync(filePath).toString();

	return await interpreter(duolangString, treeString);
}

for (let i = 0; i < 100; ++i) {
	const result = await main(process.argv[2]);
	if (result !== undefined) {
		console.log(result);
	}
}
