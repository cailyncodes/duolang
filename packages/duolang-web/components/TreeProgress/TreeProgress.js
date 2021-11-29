
import React from 'react';
import styles from './styles.module.css';
import DuolangContext from '../../contexts/Duolang';
import Skill from '../Skill/Skill';

export default function TreeProgress() {
	const { tree, progress, setProgress } = React.useContext(DuolangContext);
	const remainingProgress = [...progress || []];

	const updateProgress = (coordinates) => (newSkillProgress) => {
		const [row, col] = coordinates;
		let index = 0;
		for (let i = 0; i < row; ++i) {
			index += parseInt(tree[i]);
		}
		index += col;

		const newProgess = [...progress];
		newProgess[index] = newSkillProgress.toString();
		setProgress(newProgess)
	}

	return (
		<div className={styles.tree}>
			{(tree || []).map((row, rowIndex) => {
				const rowSize = parseInt(row);
				while (rowSize > remainingProgress.length) {
					remainingProgress.push('0');
				}
				const skillsInRow = remainingProgress.splice(0, rowSize);

				return (
					<div key={`row-${rowIndex}`} className={styles.row}>
						{skillsInRow.map(
							(skillProgress, colIndex) => 
								<Skill
									key={`row-${rowIndex}-col-${colIndex}`}
									progress={parseInt(skillProgress) || 0}
									updateProgress={updateProgress([rowIndex, colIndex])}
								/>
							)
						}
					</div>
				)
			})}
		</div>
	)
}