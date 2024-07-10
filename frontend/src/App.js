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
import { AppContext } from './store/AppContext';

const App = () => {
    const [loadingMsg, setLoadingMsg] = useState('');
    const { authState, login, verify } = useContext(AuthContext);
    const { tasksState, loadTasks, createTask, updateTask, deleteTask } = useContext(TasksContext);
    const { usersState, loadUsers, updateUser } = useContext(UsersContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);

    useEffect(() => {
        if (authState.verified)
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
            .catch((error) => {
                verify();
                console.error(error);
            })
            .finally(() => setLoadingMsg(''));

    }, [socketState, login, authState, addToast, verify]);

    useEffect(() => {
        if (!authState.authenticated || tasksState.loaded)
            return;

        setLoadingMsg("Fetching your tasks, please wait...");
        axios.get(`http://localhost:4000/api/tasks/${authState.user._id}`)
            .then(({ data }) => {
                loadTasks(data.tasks);
            })
            .catch((error) => {
                loadTasks([]);
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => setLoadingMsg(''));

    }, [loadTasks, tasksState, authState, addToast]);

    useEffect(() => {
        if (usersState.loaded)
            return;

        setLoadingMsg("Fetching Users details, please wait...");
        axios.get("http://localhost:4000/api/users")
            .then(({ data }) => {
                loadUsers(data.users);
            })
            .catch((error) => {
                loadUsers([]);
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => setLoadingMsg(''));

    }, [usersState, loadUsers, addToast]);

    useEffect(() => {
        socketState.socket.on('user_followed', (authUser, userToFollow, message) => {
            updateUser(authUser);
            updateUser(userToFollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
                addToast({ type: 'info', message });
            }
            if (authState.user._id === userToFollow._id) {
                login(userToFollow);
                addToast({ type: 'info', message: `${authUser.name} followed you` });
            }
        });

        return () => socketState.socket.off('user_followed');
    }, [socketState, authState, login, updateUser, addToast]);


    useEffect(() => {
        socketState.socket.on('user_unfollowed', (authUser, userToUnfollow, message) => {
            updateUser(authUser);
            updateUser(userToUnfollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
                addToast({ type: 'info', message });
            }
            if (authState.user._id === userToUnfollow._id) {
                login(userToUnfollow);
                addToast({ type: 'info', message: `${authUser.name} Unfollowed you` });
            }
        });

        return () => socketState.socket.off('user_unfollowed');
    }, [socketState, authState, login, updateUser, addToast]);


    useEffect(() => {
        socketState.socket.on('task_created', (task, message) => {
            if (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) {
                createTask(task);
                addToast({ type: 'success', message });
            }
        });

        return () => socketState.socket.off('task_created');
    }, [socketState, authState, createTask, addToast]);


    useEffect(() => {
        socketState.socket.on('task_updated', (task, message) => {
            if (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) {
                updateTask(task);
                addToast({ type: 'info', message });
            }
        });

        return () => socketState.socket.off('task_updated');
    }, [socketState, authState, updateTask, addToast]);

    useEffect(() => {
        socketState.socket.on('task_deleted', (taskId, assignedTo, assignedBy, message) => {
            if (authState.user._id === assignedBy._id || authState.user._id === assignedTo._id) {
                deleteTask(taskId);
                addToast({ type: 'warning', message });
            }
        });

        return () => socketState.socket.off('task_deleted');
    }, [socketState, authState, deleteTask, addToast]);

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