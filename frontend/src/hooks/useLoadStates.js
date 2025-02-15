import { useContext, useEffect } from 'react';

import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';
import { NotificationsContext } from '../store/NotificationContext';
import { notifications, tasks, users } from '../utils/apiendpoints';

const useLoadStates = () => {
    const { loadTasks, tasksState } = useContext(TasksContext);
    const { loadUsers, usersState } = useContext(UsersContext);
    const { loadNotifications, notificationsState } = useContext(NotificationsContext);

    useEffect(() => {
        if (!usersState.loaded) {
            users.all()
                .then(({ data }) => loadUsers(data.users))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadUsers, usersState]);

    useEffect(() => {
        if (!notificationsState.loaded) {
            notifications.all()
                .then(({ data }) => loadNotifications(data.notifications))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadNotifications, notificationsState]);

    useEffect(() => {
        if (!tasksState.loaded) {
            tasks.all()
                .then(({ data }) => loadTasks(data.tasks))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadTasks, tasksState]);
}

export default useLoadStates;