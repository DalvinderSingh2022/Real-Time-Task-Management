import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import styles from '../styles/userdetails.module.css';
import homeStyles from "../styles/home.module.css";
import userStyles from "../styles/users.module.css";
import tasksStyles from "../styles/tasks.module.css";
import taskdetailsStyles from '../styles/taskdetails.module.css';

import { TasksContext } from '../store/TasksContext';
import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import NotFound from '../pages/NotFound';
import Task from '../components/Task';
import User from '../components/User';

const UserDetails = () => {
    const { addToast } = useContext(AppContext);
    const { tasksState } = useContext(TasksContext);
    const { authState } = useContext(AuthContext);
    const [invalidId, setInvalidId] = useState(false);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [tasks, setTasks] = useState(null)
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            axios.get(`https://task-manager-v4zl.onrender.com/api/users/${id}`)
                .then(({ data }) => {
                    setUser(data.user);
                })
                .catch((error) => {
                    setInvalidId(true);
                    addToast({ type: 'error', message: error?.response?.data?.message })
                    console.error(error);
                });
        })();
    }, [id, addToast]);

    useEffect(() => {
        if (!id || !tasksState.loaded) return;

        setTasks(tasksState.tasks.filter(task =>
            (task.assignedBy._id === authState.user._id && task.assignedTo._id === id) ||
            (task.assignedTo._id === authState.user._id && task.assignedBy._id === id)
        ));
    }, [id, tasksState, authState]);

    useEffect(() => {
        if (!user) return;

        setUsers(user.followers.filter(user =>
            authState.user.followers.find(u => u._id === user._id)
        ));
    }, [user, authState]);

    if (invalidId) return <NotFound />;

    return (
        <div className={`${taskdetailsStyles.container} ${styles.container} ${homeStyles.article}`}>
            <section className={`flex col ${taskdetailsStyles.wrapper} ${styles.wrapper} ${homeStyles.article}`}>
                <section className={`${homeStyles.graph} ${homeStyles.tasks} ${styles.tasks}`}>
                    <header className={`flex ${homeStyles.header}`}>
                        <h3 className='text_primary'>Same Tasks</h3>
                    </header>
                    <div className={`flex col gap2 tasks_container ${tasksStyles.tasks_container} ${homeStyles.tasks_wrapper}`}>
                        {tasks?.length
                            ? tasks.map(task => <Task {...task} key={task._id} />)
                            : tasks ? <div className='text_secondary flex'>There is no task</div> : <div className='loading'></div>
                        }
                    </div>
                </section>

                <section className={`${homeStyles.graph} ${homeStyles.followers} ${styles.users}`}>
                    <header className={`flex ${homeStyles.header}`}>
                        <h3 className='text_primary'>Common Followers</h3>
                    </header>
                    <div className={`flex gap2 wrap ${userStyles.wrapper} ${homeStyles.followers_wrapper}`}>
                        {users?.length
                            ? users.map(user => <User {...user} key={user._id} />)
                            : users ? <div className='text_secondary flex'>There is no follower</div> : <div className="loading"></div>
                        }
                    </div>
                </section>
            </section>
        </div>
    )
}

export default UserDetails;