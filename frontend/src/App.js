import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import Loading from './components/Loading';

import { AuthContext } from './store/AuthContext';
import { TasksContext } from './store/TasksContext';
import { SocketContext } from './store/SocketContext';
import { AppContext } from './store/AppContext';
import { DragAndDropProvider } from './store/DragAndDropContext';
import { UsersContext } from './store/UsersContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Users = lazy(() => import('./pages/Users'));
const Notfound = lazy(() => import('./pages/NotFound'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));

const App = () => {
    const [loadingMsg, setLoadingMsg] = useState('');
    const { authState, login, verify } = useContext(AuthContext);
    const { loadTasks, createTask, updateTask, deleteTask } = useContext(TasksContext);
    const { addUser, updateUser, deleteUser } = useContext(UsersContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);

    useEffect(() => {
        if (authState.verified) return;

        setLoadingMsg("Fetching user details, please wait...");
        (async () => {
            try {
                const userData = await axios.get("https://task-manager-v4zl.onrender.com/api/users/current", {
                    headers: {
                        Authorization: localStorage.getItem("jwt")
                    }
                });
                login(userData.data.user);
                setLoadingMsg('');

                const tasksData = await axios.get(`https://task-manager-v4zl.onrender.com/api/tasks/${userData.data.user._id}`);
                loadTasks(tasksData.data.tasks);
            } catch (error) {
                verify();
                setLoadingMsg('');
                console.error(error);
                addToast({ type: 'error', message: error?.response?.data?.message });
            }
        })();
    }, [addToast, authState.verified, loadTasks, login, verify]);


    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('task_deleted', (task, assignedTo, assignedBy) => {
            if (authState.user._id === assignedBy._id) {
                deleteTask(task._id);
                addToast({ type: 'warning', message: `Task : ${task.title} Deleted` });
            }
            else if (authState.user._id === assignedTo._id) {
                deleteTask(task._id);
                addToast({ type: 'warning', message: `${assignedBy.name} Deleted Task : ${task.title}` });
            }
        });

        return () => socketState.socket.off('task_deleted');
    }, [socketState, authState, deleteTask, addToast]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('task_created', (task) => {
            if (authState.user._id === task.assignedBy._id) {
                createTask(task);
                addToast({ type: 'success', message: `Task created and assigned to ${task.assignedTo._id !== task.assignedBy._id ? task.assignedTo.name : 'Self'}` });
            }
            else if (authState.user._id === task.assignedTo._id) {
                createTask(task);
                addToast({ type: 'info', message: `Task: ${task.title} assigned by ${task.assignedBy.name}` });
            }
        });

        return () => socketState.socket.off('task_created');
    }, [socketState, authState, createTask, addToast]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('task_updated', (task, user) => {
            if (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) {
                updateTask(task);
                addToast({ type: 'info', message: `Task: ${task.title} updated by ${user.name}` });
            }
        });

        return () => socketState.socket.off('task_updated');
    }, [addToast, socketState, updateTask, authState]);


    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('user_followed', (authUser, userToFollow) => {
            updateUser(authUser);
            updateUser(userToFollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
                addToast({ type: 'success', message: `Followed ${userToFollow.name} successfully` });
            }
            if (authState.user._id === userToFollow._id) {
                login(userToFollow);
                addToast({ type: 'info', message: `${authUser.name} followed you` });
            }
        });

        return () => socketState.socket.off('user_followed');
    }, [socketState, authState, login, updateUser, addToast]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('user_unfollowed', (authUser, userToUnfollow) => {
            updateUser(authUser);
            updateUser(userToUnfollow);

            if (authState.user._id === authUser._id) {
                login(authUser);
                addToast({ type: 'info', message: `Unfollowed ${userToUnfollow.name} successfully` });
            }
            if (authState.user._id === userToUnfollow._id) {
                login(userToUnfollow);
                addToast({ type: 'info', message: `${authUser.name} Unfollowed you` });
            }
        });

        return () => socketState.socket.off('user_unfollowed');
    }, [socketState, authState, login, updateUser, addToast]);


    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('user_left', user => {
            deleteUser(user._id);
        });

        return () => socketState.socket.off('user_left');
    }, [socketState, deleteUser]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('user_join', user => {
            addUser(user);
        });

        return () => socketState.socket.off('user_join');
    }, [socketState, addUser]);

    if (loadingMsg || !authState.verified) {
        return <Loading message={loadingMsg} />
    }

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='tasks'>
                        <Route index element={<DragAndDropProvider><Tasks /></DragAndDropProvider>} ></Route>
                        <Route path=':id' element={<TaskDetails />}></Route>
                    </Route>
                    <Route path="/users" element={<Users />} />
                    <Route path='*' element={<Notfound />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App;