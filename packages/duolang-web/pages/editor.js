import cx from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/Footer/Footer';
import Interpreter from '../components/Interpreter/Interpreter';
import Loader from '../components/Loader/Loader';
import TreeProgress from '../components/TreeProgress/TreeProgress';
import config from '../config';
import DuolangContext from "../contexts/Duolang";
import { HELLO_WORLD_PROGRESS, HELLO_WORLD_TREE, INCREMENT_PROGRESS, INCREMENT_TREE } from '../lib/duolang-examples';
import styles from '../styles/Editor.module.css';

const { apiUrl } = config;

export default function Editor() {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [tree, setTree] = React.useState(undefined);
	const [progress, setProgress] = React.useState(undefined);
	const [course, setCourse] = React.useState({});
	const [courses, setCourses] = React.useState([]);
	const [selectedCourseIndex, setSelectedCourseIndex] = React.useState(courses.findIndex(_course => _course.id === course.courseId));
	const [isHelloWorldActive, setIsHelloWorldActive] = React.useState(false);
	const [isIncrementActive, setIsIncrementActive] = React.useState(false);
	const [jwt, setJwt] = React.useState('');
	const [username, setUsername] = React.useState('');

	React.useEffect(() => {
		const jwt = window.localStorage.getItem('duolingo_jwt');
		const username = window.localStorage.getItem('duolingo_username');
		if (!jwt || !username) {
			router.push('/');
			return;
		}
		setJwt(jwt);
		setUsername(username);
	}, []);

	const fetchData = React.useCallback(async () => {
		async function getCurrentCourse() {
			const response = await fetch(`${apiUrl}/current-course`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${jwt}`,
					'X-Duolingo-Username': username,
				}
			});

			return await response.json();
		}

		async function getCurrentTree() {
			const response = await fetch(`${apiUrl}/current-tree`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${jwt}`,
					'X-Duolingo-Username': username,
				}
			});

			return await response.json();
		}

		async function getCurrentProgress() {
			const response = await fetch(`${apiUrl}/current-progress`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${jwt}`,
					'X-Duolingo-Username': username,
				}
			});

			return await response.json();
		}

		async function getCourses() {
			const response = await fetch(`${apiUrl}/courses`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${jwt}`,
					'X-Duolingo-Username': username,
				}
			});

			return await response.json();
		}

		const [course, tree, progress, courses] = await Promise.all([getCurrentCourse(), getCurrentTree(), getCurrentProgress(), getCourses()]);
		setTree(tree);
		setProgress(progress);
		setCourse(course);
		setCourses(courses);
		setLoading(false);
		setSelectedCourseIndex(courses.findIndex(_course => _course.id === course.courseId));
		setIsHelloWorldActive(false);
		setIsIncrementActive(false);
	}, [jwt, username]);

	React.useEffect(() => {
		if (jwt) {
			setLoading(true);
			void fetchData();
		}
	}, [jwt]);

	React.useEffect(() => {
		async function changeCourse() {
			const selectedCourse = courses[selectedCourseIndex];

			if (!selectedCourse || selectedCourse.id === course.courseId) {
				return;
			}
		
			const body = JSON.stringify({
				courseId: selectedCourse.id,
				toLanguage: selectedCourse.learningLanguage,
				fromLanguage: selectedCourse.fromLanguage,
			});

			await fetch(`${apiUrl}/change-course`, {
				method: 'POST',
				headers: {
					'Content-Length': body.length,
					'Authorization': `Bearer ${jwt}`,
					'X-Duolingo-Username': username,
				},
				body,
			});

			await handleRefreshData();
		}

		if (selectedCourseIndex >= 0) {
			void changeCourse();
		}
	}, [selectedCourseIndex]);

	const handleRefreshData = async () => {
		setLoading(true);
		setIsHelloWorldActive(false);
		setIsIncrementActive(false);
		await fetchData();
	}

	const handleCourseSelect = async (e) => {
		setLoading(true);
		// subtract 1 for the default option
		const newCourseIndex = e.target.selectedIndex - 1;
		setSelectedCourseIndex(newCourseIndex);
		setIsHelloWorldActive(false);
		setIsIncrementActive(false);
	}

	const handleHelloWorld = async () => {
		setTree(HELLO_WORLD_TREE);
		setProgress(HELLO_WORLD_PROGRESS);
		setSelectedCourseIndex(-1);
		setIsHelloWorldActive(true);
		setIsIncrementActive(false);
	}

	const handleIncrement = async () => {
		setTree(INCREMENT_TREE);
		setProgress(INCREMENT_PROGRESS);
		setSelectedCourseIndex(-1);
		setIsHelloWorldActive(false);
		setIsIncrementActive(true);
	}

	return (
		<DuolangContext.Provider value={{
			tree,
			progress,
			course,
			setTree,
			setProgress,
			setCourse,
		}}>
			<Head>
				<script type="module" dangerouslySetInnerHTML={
					{
						__html:
							`import { interpreter } from "./static/interpreter/interpreter.mjs";
							if (!window.Duolang) window.Duolang = {};
							window.Duolang.interpreter = interpreter;
							`
					}
				}></script>
			</Head>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.editor}>
						<div className={styles['editor-header']}>
							<h1>Duolingo Tree</h1>
							<div>
								<button onClick={handleRefreshData} title="Reset any tree modifications and refresh the most recent data for your current course from Duolingo">Reset {'&'} Refresh</button>
								<div className={cx(styles.select, { [styles.active]: !isHelloWorldActive && !isIncrementActive } )} title="Select one of your started courses from Duolingo">
									<select onChange={handleCourseSelect} value={selectedCourseIndex >= 0 ? courses[selectedCourseIndex].id : ''}>
										<option key="default" disabled value="">Select a course</option>
										{courses.map(course => <option key={course.id} value={course.id}>{course.learningLanguage} from {course.fromLanguage}</option>)}
									</select>
								</div>
								<button className={cx({ [styles.active]: isHelloWorldActive })} onClick={handleHelloWorld} title="Show a Hello World program">Hello world</button>
								<button className={cx({ [styles.active]: isIncrementActive })} onClick={handleIncrement} title="Show a primality test program">Increment</button>
							</div>
						</div>
						<div className={styles.tree}>
							{loading && <div className={styles['tree-loader']}><Loader /></div>}
							{!loading && <TreeProgress />}
						</div>
					</div>
					<div className={styles.interpreter}>
						<div className={styles['interpreter-header']}>
							<h1>Interpreter</h1>
						</div>
						<div className={styles.execution}>
							<Interpreter />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</DuolangContext.Provider>
	)
}
