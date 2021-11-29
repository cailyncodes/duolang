import styles from './styles.module.css';
import cx from 'classnames';
import React from 'react';

const PROGRESS_CLASSNAME_MAP = {
	0: 'zero',
	1: 'one',
	2: 'two',
	3: 'three',
	4: 'four',
	5: 'golden',
	6: 'legendary',
}

export default function Skill({ progress, updateProgress }) {

	const handleClick = () => {
		const newProgress = (progress + 1) % 7;
		updateProgress(newProgress);
	}

	return (
		<div
			className={
				cx(styles.skill, styles[PROGRESS_CLASSNAME_MAP[progress]])
			}
			onClick={handleClick}
		>
			{progress}
		</div>
	)
}