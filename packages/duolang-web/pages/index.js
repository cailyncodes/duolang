import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Footer from '../components/Footer/Footer';
import Login from '../components/Login/Login';
import styles from '../styles/Home.module.css';

export default function Home({ host, url }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Duolang</title>
				<meta name="description" content="Duolang - An esoteric meta programming language built on Duolingo" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1>Welcome to Duolang!</h1>
				<p>{'<'}insert trademarked cute green owl{'>'}</p>
				<div className={styles.description}>
					<p>Duolang is an esoteric meta programming language: Duolingo is your code editor and your progress in a course is the source code. You can use this site (<Link href={url}>{host}</Link>) to execute the programs and also more easily simulate edits to both your progress and tree.</p>
					<p>Check out the <a href="https://github.com/cailyncodes/duolang" target="_blank" rel="noreferrer noopener">Github</a> for more information about the syntax/grammar, design philosophy, and general motivation.</p>
				</div>
				<Login />
			</main>

			<Footer />
		</div>
	)
}

export function getServerSideProps({ req }) {
	return {
		props: {
			host: req.headers.host,
			url: req.url
		}
	}
}
