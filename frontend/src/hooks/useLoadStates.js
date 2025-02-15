import { useContext, useEffect } from 'react';

import { AppContext } from '../store/AppContext';
import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';
import { NotificationsContext } from '../store/NotificationContext';
import { notifications, tasks, users } from '../utils/apiendpoints';

const useLoadStates = (user) => {
    const { addToast } = useContext(AppContext);
    const { loadTasks, tasksState } = useContext(TasksContext);
    const { loadUsers, usersState } = useContext(UsersContext);
    const { loadNotifications, notificationsState } = useContext(NotificationsContext);

    useEffect(() => {
        if (!usersState.loaded && user) {
            users.all()
                .then(({ data }) => loadUsers(data.users))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadUsers, usersState, addToast, user]);

    useEffect(() => {
        if (!notificationsState.loaded && user) {
            notifications.all()
                .then(({ data }) => loadNotifications(data.notifications))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadNotifications, notificationsState, addToast, user]);

    useEffect(() => {
        if (!tasksState.loaded && user) {
            tasks.all()
                .then(({ data }) => loadTasks(data.tasks))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadTasks, tasksState, addToast, user]);
}

export default useLoadStates;