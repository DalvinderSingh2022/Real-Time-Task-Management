import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";

import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

import styles from "./../styles/auth.module.css";

import Toast from '../components/Toast';
import Response from '../components/Response';

import { NotificationsContext } from '../store/NotificationContext';
import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';

const Login = () => {
    const { authState, login } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const { loadTasks } = useContext(TasksContext);
    const { loadUsers } = useContext(UsersContext);
    const { loadNotifications } = useContext(NotificationsContext);
    const [response, setResponse] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        const user = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        setResponse(true);
        axios.put("https://task-manager-v4zl.onrender.com/api/users/login", user)
            .then(({ data }) => {
                login(data.user);
                localStorage.setItem("jwt", data.token);
                addToast({ type: 'success', message: data.message });
                navigate("/");
                (async () => {
                    const [tasksData, notificationsData, usersData] = await Promise.all([
                        axios.get(`https://task-manager-v4zl.onrender.com/api/tasks/all/${data.user._id}`),
                        axios.get(`https://task-manager-v4zl.onrender.com/api/notifications/all/${data.user._id}`),
                        axios.get("https://task-manager-v4zl.onrender.com/api/users/all")
                    ]);
                    loadUsers(usersData.data.users);
                    loadTasks(tasksData.data.tasks);
                    loadNotifications(notificationsData.data.notifications);
                })();
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    if (authState.authenticated) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Toast />
            {response && <Response />}
            <div className="flex full_container">
                <section className={`flex col gap ${styles.container}`}>
                    <div>
                        <div className={`w_full text_primary ${styles.heading}`}>Welcome back</div>
                        <div className={`w_full text_secondary ${styles.sub_heading}`}>Please enter your details.</div>
                    </div>
                    <form className={`flex col gap w_full ${styles.form}`} onSubmit={(e) => handlesubmit(e)}>
                        <div className={`flex col w_full ${styles.group}`}>
                            <label htmlFor="email" className='text_primary'>Email</label>
                            <input
                                type="email"
                                id='email'
                                name='email'
                                placeholder='exapmle@domain.com'
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className={`flex col w_full ${styles.group}`}>
                            <label htmlFor="password" className='text_primary'>Password</label>
                            <input
                                type={show ? 'text' : 'password'}
                                id='password'
                                name='password'
                                placeholder='12345678'
                                required
                                autoComplete="current-password"
                            />
                            <span className={`${styles.password_eye} flex`} onClick={() => setShow(prev => !prev)}>{show ? <FiEyeOff /> : <FiEye />}</span>
                        </div>

                        <div className={`flex col w_full ${styles.group}`}>
                            <button type='submit' className={`button primary flex gap2 ${styles.submit_button}`}>Log In{response && <div className='loading'></div>}</button>
                        </div>

                        <div className={styles.link}>
                            Don’t have an account?
                            <Link to='/register' className={styles.submit_button}>register</Link>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}

export default Login;