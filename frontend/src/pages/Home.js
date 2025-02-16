import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../store/AuthContext';

import styles from "../styles/home.module.css";
import userSstyles from "../styles/users.module.css";
import tasksStyles from "../styles/tasks.module.css";

import User from '../components/User';
import Task from '../components/Task';
import { TasksContext } from '../store/TasksContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { authState } = useContext(AuthContext);
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowings] = useState(0);

    useEffect(() => {
        const taskCounts = tasksState.tasks.reduce((acc, task) => {
            const status = task.status.toLowerCase().replaceAll(" ", '');

            if (status === 'notstarted') acc.notStarted++;
            if (status === 'inprogress') acc.inProgress++;
            if (status === 'completed') acc.completed++;

            return acc;
        }, { notStarted: 0, inProgress: 0, completed: 0 });

        setNotStarted(taskCounts.notStarted);
        setProgress(taskCounts.inProgress);
        setCompleted(taskCounts.completed);
    }, [tasksState]);

    useEffect(() => {
        if (authState.authenticated) {
            setFollowers(authState.user.followers.length);
            setFollowings(authState.user.following.length);
        }
    }, [authState])

    return (
        <article className={styles.article}>
            <section className={styles.graph}>
                <header>
                    <h2 className='text_primary'>Tasks</h2>
                    <h4 className='text_secondary'>Tasks Allocated by Current Status</h4>
                </header>
                <div className={`flex col gap ${styles.graph_wrapper}`}>
                    <div className="total">
                        <span className={styles.graph_total}>{tasksState.tasks?.length || 0}</span>
                        <h4>Tasks</h4>
                    </div>
                    <div className={`flex ${styles.graph_bar}`}>
                        <Link to={`/tasks?status=Completed`} className={styles.bar_child} style={{ width: `${((completed / (completed + notStarted + progress)) * 100)}%`, backgroundColor: 'var(--green)' }}></Link>
                        <Link to={`/tasks?status=In+Progress`} className={styles.bar_child} style={{ width: `${(progress / (completed + notStarted + progress)) * 100}%`, backgroundColor: 'var(--blue)', transitionDelay: '0.2s' }}></Link>
                        <Link to={`/tasks?status=Not+Started`} className={styles.bar_child} style={{ width: `${(notStarted / (completed + notStarted + progress)) * 100}%`, backgroundColor: 'var(--grey)', transitionDelay: '0.4s' }}></Link>
                    </div>
                    <div className={`flex col gap2`}>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--green)' }}></div>
                            <span>Completed: {completed}</span>
                        </div>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--blue)' }}></div>
                            <span>In Progress: {progress}</span>
                        </div>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--grey)' }}></div>
                            <span>Not Started: {notStarted}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.graph}>
                <header>
                    <h2 className='text_primary'>Users</h2>
                    <h4 className='text_secondary'>Connected Users by Relation</h4>
                </header>
                <div className={`flex col gap ${styles.graph_wrapper}`}>
                    <div className="total">
                        <span className={styles.graph_total}>{(followers + following) || 0}</span>
                        <h4>Connections</h4>
                    </div>
                    <div className={`flex ${styles.graph_bar}`}>
                        <Link to='/users/followers' className={styles.bar_child} style={{ width: `${(followers / (followers + following)) * 100}%`, backgroundColor: 'var(--purple-light)' }}></Link>
                        <Link to='/users/following' className={styles.bar_child} style={{ width: `${(following / (following + followers)) * 100}%`, backgroundColor: 'var(--purple-dark)', transitionDelay: '0.2s' }}></Link>
                    </div>
                    <div className={`flex col gap2`}>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--purple-light)' }}></div>
                            <span>Followers : {followers}</span>
                        </div>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--purple-dark)' }}></div>
                            <span>Following : {following}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tasks}>
                <header className={`flex ${styles.header}`}>
                    <h3 className='text_primary'>Recent Tasks</h3>
                </header>
                <div className={`flex col gap2 tasks_container ${tasksStyles.tasks_container} ${styles.tasks_wrapper}`}>
                    {tasksState.tasks.length
                        ? tasksState.tasks.slice(0, 3).map(task => <Task {...task} key={task._id} />)
                        : tasksState.loaded ? <div className='text_secondary flex'>There is no task</div> : <div className={`loading ${styles.loading}`}></div>
                    }
                </div>
            </section>

            <section className={styles.followers}>
                <header className={`flex ${styles.header}`}>
                    <h3 className='text_primary'>Your Followers</h3>
                </header>
                <div className={`flex gap2 wrap ${userSstyles.wrapper} ${styles.followers_wrapper}`}>
                    {authState.user.followers?.length
                        ? authState.user.followers.map(user => <User {...user} key={user._id} />)
                        : authState.authenticated ? <div className='text_secondary flex'>There is no follower</div> : <div className="loading"></div>
                    }
                </div>
            </section>
        </article >
    )
}

export default Home;