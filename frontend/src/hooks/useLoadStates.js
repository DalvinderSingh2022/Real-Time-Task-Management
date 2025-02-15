import { useContext, useEffect } from 'react';

import { AppContext } from '../store/AppContext';
import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';
import { NotificationsContext } from '../store/NotificationContext';
import { notifications, tasks, users } from '../utils/apiendpoints';

const useLoadStates = () => {
    const { addToast } = useContext(AppContext);
    const { loadTasks, tasksState } = useContext(TasksContext);
    const { loadUsers, usersState } = useContext(UsersContext);
    const { loadNotifications, notificationsState } = useContext(NotificationsContext);

    useEffect(() => {
        if (!usersState.loaded) {
            users.all()
                .then(({ data }) => loadUsers(data.users))
                .catch(error => {
                    addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                    console.log(".....API ERROR.....", error);
                });
        }
    }, [loadUsers, usersState, addToast]);

    useEffect(() => {
        if (!notificationsState.loaded) {
            notifications.all()
                .then(({ data }) => loadNotifications(data.notifications))
                .catch(error => {
                    addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                    console.log(".....API ERROR.....", error);
                });
        }
    }, [loadNotifications, notificationsState, addToast]);

    useEffect(() => {
        if (!tasksState.loaded) {
            tasks.all()
                .then(({ data }) => loadTasks(data.tasks))
                .catch(error => {
                    addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                    console.log(".....API ERROR.....", error);
                });
        }
    }, [loadTasks, tasksState, addToast]);
}

export default useLoadStates;