import styles from './styles.module.css';

export default function Footer() {
	return <footer className={styles.footer}>
		<span>
			Made by{' '}<a href="https://github.com/cailyncodes" target="_blank" rel="noopener noreferrer">cailyncodes</a>{' '}with frequent support from{' '}<a href="https://i-completed-a-task-give-me-a-narwhal.vercel.app/" target="_blank" rel="noopener noreferrer">narwhals</a>
		</span>
	</footer>
}
