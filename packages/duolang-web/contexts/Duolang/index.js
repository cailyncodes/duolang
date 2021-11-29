import React from 'react';

const DuolangContext = React.createContext({
	tree: [],
	progress: [],
	course: {},
	setTree: () => {},
	setProgress: () => {},
	setCourse: () => {},
});

const { Consumer, Provider } = DuolangContext;

export { Consumer, Provider };
export default DuolangContext;
