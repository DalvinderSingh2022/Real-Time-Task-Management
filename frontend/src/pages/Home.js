import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../store/AuthContext';

import styles from "../styles/home.module.css";
import userSstyles from "../styles/users.module.css";
import tasksStyles from "../styles/tasks.module.css";

import User from '../components/User';
import Task from '../components/Task';
import { TasksContext } from '../store/TasksContext';

const Home = () => {
    const { authState } = useContext(AuthContext);
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [bySelf, setBySelf] = useState(0);
    const [byOthers, setByOthers] = useState(0);

    useEffect(() => {
        setNotStarted(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'notstarted').length);
        setProgress(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'inprogress').length);
        setCompleted(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'completed').length);


        setBySelf(tasksState.tasks.filter(task => task.assignedBy._id === authState.user._id).length);
        setByOthers(tasksState.tasks.filter(task => task.assignedBy._id !== authState.user._id).length);
    }, [tasksState, authState]);

    const navigate = useNavigate();

    return (
        <article className={styles.article}>
            <section className={styles.graph}>
                <header>
                    <h2 className='text_primary'>Tasks</h2>
                    <h4 className='text_secondary'>Task Allocation by Current Status</h4>
                </header>
                <div className={`flex col gap ${styles.graph_wrapper}`}>
                    <div className="total">
                        <span className={styles.graph_total}>{tasksState.tasks.length}</span>
                        <h4>Total</h4>
                    </div>
                    <div className={`flex ${styles.graph_bar}`}>
                        <div className={styles.bar_child} style={{ width: `${(completed / (completed + notStarted + progress)) * 100}%`, backgroundColor: 'var(--green)' }}></div>
                        <div className={styles.bar_child} style={{ width: `${(progress / (completed + notStarted + progress)) * 100}%`, backgroundColor: 'var(--blue)' }}></div>
                        <div className={styles.bar_child} style={{ width: `${(notStarted / (completed + notStarted + progress)) * 100}%`, backgroundColor: 'var(--grey)' }}></div>
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
                    <h2 className='text_primary'>Tasks</h2>
                    <h4 className='text_secondary'>Task Allocation by users</h4>
                </header>
                <div className={`flex col gap ${styles.graph_wrapper}`}>
                    <div className="total">
                        <span className={styles.graph_total}>{tasksState.tasks.length}</span>
                        <h4>Total</h4>
                    </div>
                    <div className={`flex ${styles.graph_bar}`}>
                        <div className={styles.bar_child} style={{ width: `${(bySelf / (bySelf + byOthers)) * 100}%`, backgroundColor: 'var(--purple-light)' }}></div>
                        <div className={styles.bar_child} style={{ width: `${(byOthers / (byOthers + bySelf)) * 100}%`, backgroundColor: 'var(--purple-dark)' }}></div>
                    </div>
                    <div className={`flex col gap2`}>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--purple-light)' }}></div>
                            <span>Self : {bySelf}</span>
                        </div>
                        <div className={`flex gap2 ${styles.legend}`}>
                            <div style={{ backgroundColor: 'var(--purple-dark)' }}></div>
                            <span>Others : {byOthers}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.followers}>
                <header className={`flex ${styles.header}`}>
                    <h2 className='text_primary'>Followers</h2>
                    <button onClick={() => navigate('users')} className='button primary'>All Users</button>
                </header>
                <div className={`${userSstyles.wrapper} ${styles.followers_wrapper}`}>
                    {authState.user.following?.length > 0
                        ? authState.user.following.map(user => <User {...user} key={user._id} />)
                        : (authState.user.following?.length !== 0 ? <div className="loading"></div> : <div style={{ backgroundColor: 'inherit' }}>There is no follower</div>)
                    }
                </div>
            </section>

            <section className={styles.tasks}>
                <header className={`flex ${styles.header}`}>
                    <h2 className='text_primary'>Tasks</h2>
                    <button onClick={() => navigate('tasks')} className='button primary'>All Tasks</button>
                </header>
                <div className={`flex col gap tasks_container ${tasksStyles.tasks_container} ${styles.tasks_wrapper}`}>
                    {tasksState.tasks?.length > 0
                        ? tasksState.tasks.slice(0, 3).map((task, index) => <Task {...task} key={task._id} />)
                        : (tasksState.tasks?.length !== 0 ? <div className={`loading ${styles.loading}`}></div> : <div>There is no task</div>)
                    }
                </div>
            </section>
        </article >
    )
}

export default Home;