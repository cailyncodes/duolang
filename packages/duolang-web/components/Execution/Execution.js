import styles from './styles.module.css';

export default function Execution({ execution, isMostRecent, handleRerun }) {
	return (
		<div className={styles.execution}>
			<div>$ duolang ./main.duolang ./structure.tree</div>
			{execution.outputs.map((output, i) => <div key={i}>{output}</div>)}
			<div>{execution.result}</div>
			{isMostRecent && (
				<div>
					<div>{<>$ <button className={styles.rerun} onClick={handleRerun}>Run</button></>}</div>
				</div>
			)}
		</div>
	)
}