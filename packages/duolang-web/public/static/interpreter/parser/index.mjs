export function duolangParser(duolangString) {
	return duolangString.split('\n').map(row => {
		let processedRow = row;
		const indexOfComment = row.indexOf('#');
		if (indexOfComment > -1) {
			processedRow = processedRow.substr(0, indexOfComment);
		}
		processedRow = processedRow.trim();
		return processedRow.split(' ');
	}).flat().join('');
}

export function treeParser(treeString) {
	let treeStructure = treeString.split('\n');
	treeStructure = treeStructure.filter(val => !val.startsWith('--')).map(val => +val);
	return treeStructure;
}
