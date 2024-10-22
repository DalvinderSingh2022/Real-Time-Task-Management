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
import { NotificationsContext } from './store/NotificationContext.js';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Users = lazy(() => import('./pages/Users'));
const Notfound = lazy(() => import('./pages/NotFound'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));
const Notifications = lazy(() => import('./pages/Notifications.js'));

const App = () => {
    const [loadingMsg, setLoadingMsg] = useState('');
    const { authState, login, verify } = useContext(AuthContext);
    const { tasksState, loadTasks, createTask, updateTask, deleteTask } = useContext(TasksContext);
    const { addUser, updateUser, deleteUser } = useContext(UsersContext);
    const { loadNotifications } = useContext(NotificationsContext);
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

                const [tasksData, notificationsData] = await Promise.all([
                    axios.get(`https://task-manager-v4zl.onrender.com/api/tasks/all/${userData.data.user._id}`),
                    axios.get(`https://task-manager-v4zl.onrender.com/api/notifications/all/${userData.data.user._id}`)
                ]);
                loadTasks(tasksData.data.tasks);
                loadNotifications(notificationsData.data.notifications);
            } catch (error) {
                verify();
                setLoadingMsg('');
                console.error(error);
                addToast({ type: 'error', message: error?.response?.data?.message });
            }
        })();
    }, [addToast, authState.verified, loadTasks, login, verify, loadNotifications]);


    useEffect(() => {
        if (!socketState.connected || !tasksState.loaded) return;

        tasksState.tasks.map(task =>
            socketState.socket.emit("join_room", task._id)
        );

        return () => tasksState.tasks.map(task =>
            socketState.socket.emit("leave_room", task._id)
        );
    }, [socketState, tasksState]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('task_deleted', (task, assignedTo, assignedBy) => {
            if (authState.user._id === assignedBy._id) {
                deleteTask(task._id);
                addToast({ type: 'warning', message: `Task : ${task.title} Deleted` });
            }
            else if (authState.user._id === assignedTo._id) {
                deleteTask(task._id);
                addToast({ type: 'warning', message: `Task : ${task.title} Deleted by ${assignedBy.name} ` });
            }
        });

        return () => socketState.socket.off('task_deleted');
    }, [socketState, authState, deleteTask, addToast]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('task_created', (task) => {
            if (authState.user._id === task.assignedBy._id) {
                createTask(task);
                addToast({ type: 'success', message: `Task created and assigned ${task.assignedTo._id === authState.user._id ? `to ${task.assignedTo.name}` : ''}` });
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
                addToast({ type: 'info', message: `Task: ${task.title} updated ${user._id !== authState.user._id ? `by ${user.name}` : ''}` });
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
                addToast({ type: 'warning', message: `${authUser.name} Unfollowed you` });
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
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path='*' element={<Notfound />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App;