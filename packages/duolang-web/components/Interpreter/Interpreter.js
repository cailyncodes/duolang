import React from 'react';
import styles from './styles.module.css';
import DuolangContext from '../../contexts/Duolang';
import Execution from '../Execution/Execution';
import cx from 'classnames';

export default function Interpreter() {
	const { tree, progress, setTree, setProgress } = React.useContext(DuolangContext);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState('');
	const [executionCount, setExecutionCount] = React.useState(0);
	const [executions, setExecutions] = React.useState([]);

	React.useEffect(() => {
		async function interpreter(_interpreter) {
			try {
				const result = await _interpreter(progress.join('\n'), tree.join('\n'));
				setExecutions([
					{
						result,
						outputs: [...window.Duolang?.OutputBuffer || []],
					},
					...executions
				]);
				setError(false);
			} catch (e) {
				console.error(e);
				setError(true);
			}
		}

		if (tree && progress && tree.length > 0 && progress.length > 0) {
			setLoading(false);

			if (!window.Duolang?.interpreter) {
				setError('There was a problem loading the Duolang interpreter')
			} else {
				void interpreter(window.Duolang?.interpreter)
			}
		}
	}, [!!tree, !!progress, executionCount]);

	const handleProgressChange = (e) => {
		setProgress(e.target.value.split(''))
	}

	const handleTreeChange = (e) => {
		setTree(e.target.value.split(''))
	}

	return (
		<div className={styles.container}>
			<div className={styles.program}>
				<div className={styles.code}>
					<h2>Skill level progress (main.duolang)</h2>
					<textarea value={(progress || []).join('')} onChange={handleProgressChange}></textarea>
				</div>
				<div className={styles.tree}>
					<h2>Structure of tree (structure.tree)</h2>
					<textarea value={(tree || []).join('')} onChange={handleTreeChange}></textarea>
				</div>
			</div>
			<div className={styles.result}>
				<h2>Program output</h2>
				<div className={cx(styles.output, { [styles.loading]: loading } )}>
					{loading && <p>Waiting for your Duolingo data to load...</p>}
					{error && (
						<>
							{typeof error === 'boolean' && <p>{`<There was an error executing the program>`}</p>}
							{typeof error === 'string' && <p>{error}</p>}
						</>
					)}
					{!loading && !error &&
						executions.map((execution, i) => <Execution key={i} execution={execution} handleRerun={() => setExecutionCount(_ => ++_)} isMostRecent={i === 0} />)
					}
				</div>
			</div>
		</div>
	)
}