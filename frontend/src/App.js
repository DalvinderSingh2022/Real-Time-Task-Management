import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Register from './pages/Register';
import Notfound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Users from './pages/Users';

import Layout from './components/Layout';
import Loading from './components/Loading';

import { AuthContext } from './store/AuthContext';
import { TasksContext } from './store/TasksContext';
import { UsersContext } from './store/UsersContext';
import { SocketContext } from './store/SocketContext';

const App = () => {
    const [loadingMsg, setLoadingMsg] = useState('');
    const { authState, login, logout } = useContext(AuthContext);
    const { tasksState, loadTasks, createTask, updateTask, deleteTask } = useContext(TasksContext);
    const { usersState, loadUsers, updateUser } = useContext(UsersContext);
    const { socketState } = useContext(SocketContext);

    useEffect(() => {
        if (authState.authenticated)
            return;

        setLoadingMsg("Fetching your details, please wait...");
        axios.get("http://localhost:4000/api/users/current", {
            headers: {
                Authorization: localStorage.getItem("jwt")
            }
        })
            .then(({ data }) => {
                login(data.user);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoadingMsg(''));

    }, [login, authState]);

    useEffect(() => {
        if (!authState.authenticated || tasksState.loaded)
            return;

        setLoadingMsg("Fetching your tasks, please wait...");
        axios.get(`http://localhost:4000/api/tasks/${authState.user._id}`)
            .then(({ data }) => {
                loadTasks(data.tasks);
            })
            .catch((err) => {
                loadTasks([]);
                console.error(err);
            })
            .finally(() => setLoadingMsg(''));

    }, [loadTasks, tasksState, authState]);

    useEffect(() => {
        if (usersState.loaded)
            return;

        setLoadingMsg("Fetching Users details, please wait...");
        axios.get("http://localhost:4000/api/users")
            .then(({ data }) => {
                loadUsers(data.users);
            })
            .catch((err) => {
                loadUsers([]);
                console.error(err);
            })
            .finally(() => setLoadingMsg(''));

    }, [usersState, loadUsers]);

    useEffect(() => {
        socketState.socket.on('user_connected', (user, token) => {
            login(user);
            localStorage.setItem("jwt", token);
        });

        return () => socketState.socket.off('user_connected');
    }, [socketState, login]);

    useEffect(() => {
        socketState.socket.on('user_disconnected', (userId) => {
            localStorage.removeItem("jwt");
            logout();
        });

        return () => socketState.socket.off('user_disconnected');
    }, [socketState, logout]);

    useEffect(() => {
        socketState.socket.on('user_followed', (authUser, userToFollow) => {
            updateUser(authUser);
            updateUser(userToFollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
            }
            if (authState.user._id === userToFollow._id) {
                login(userToFollow);
            }
        });

        return () => socketState.socket.off('user_followed');
    }, [socketState, authState, login, updateUser]);


    useEffect(() => {
        socketState.socket.on('user_unfollowed', (authUser, userToUnfollow) => {
            updateUser(authUser);
            updateUser(userToUnfollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
            }
            if (authState.user._id === userToUnfollow._id) {
                login(userToUnfollow);
            }
        });

        return () => socketState.socket.off('user_unfollowed');
    }, [socketState, authState, login, updateUser]);


    useEffect(() => {
        socketState.socket.on('task_created', (task) => {
            if (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) {
                createTask(task);
            }
        });

        return () => socketState.socket.off('task_created');
    }, [socketState, authState, createTask]);


    useEffect(() => {
        socketState.socket.on('task_updated', (task) => {
            if (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) {
                updateTask(task);
            }
        });

        return () => socketState.socket.off('task_updated');
    }, [socketState, authState, updateTask]);

    useEffect(() => {
        socketState.socket.on('task_deleted', (taskId, assignedTo, assignedBy) => {
            if (authState.user._id === assignedBy._id || authState.user._id === assignedTo._id) {
                deleteTask(taskId);
            }
        });

        return () => socketState.socket.off('task_deleted');
    }, [socketState, authState, deleteTask]);


    if (loadingMsg) {
        return <Loading message={loadingMsg} />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='tasks' element={<Tasks />} />
                    <Route path="/users" element={<Users />} />
                    <Route path='*' element={<Notfound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;