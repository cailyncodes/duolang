import cx from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import Loader from '../Loader/Loader';
import styles from './styles.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Login() {
	const router = useRouter();
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState(false);
	const [loginError, setLoginError] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const handleLogin = (e) => {
		e.preventDefault();
		if (!username || !password) {
			setError(true);
		} else {
			setLoading(true);
			setError(false);
		}
	}

	React.useEffect(() => {
		async function login() {
			setLoginError('');

			const body = JSON.stringify({
				username,
				password,
			})

			try {
				const response = await fetch(`${API_URL}/login`, {
					method: 'POST',
					headers: {
						'Content-Length': body.length,
						'Content-Type': 'application/json',
					},
					body
				})

				const { jwt, username: usernameResponse } = await response.json();

				if (jwt) {
					window.localStorage.setItem('duolingo_jwt', jwt);
					window.localStorage.setItem('duolingo_username', usernameResponse);
					router.push('/editor')
				} else {
					throw new Error('No JWT returned')
				}
			} catch (e) {
				console.error(e);
				setLoginError('There was an error logging into Duolingo. Please check the developer console for more information or try again later')
			} finally {
				setLoading(false);
			}
		}

		if (loading) {
			void login();
		}
	}, [loading]);

	return (
		<div className={styles.login}>
			<p>In order to import your progress and have accurate trees, please log in with your Duolingo username and password</p>
			<form>
				<label htmlFor="username">Username</label><br />
				<input className={cx({ [styles.error]: error })} name="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
				<label htmlFor="password">Password</label><br />
				<input className={cx({ [styles.error]: error })} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
				<button className={styles.actions} type="submit" onClick={handleLogin}>Login</button>
			</form>
			{loginError && <p>{loginError}</p>}
			<p>We will never store your password and use it only to show you your data</p>
			<div className={styles.loader}>
				{loading && <Loader />}
			</div>
		</div>
	)
}