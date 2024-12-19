import { useContext, useEffect } from 'react'
import axios from 'axios';

import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';
import { NotificationsContext } from '../store/NotificationContext';
import { notifications, tasks, users } from '../utils/apiendpoints';

const useLoadStates = (user) => {
    const { loadTasks, tasksState } = useContext(TasksContext);
    const { loadUsers, usersState } = useContext(UsersContext);
    const { loadNotifications, notificationsState } = useContext(NotificationsContext);

    useEffect(() => {
        if (!usersState.loaded && user) {
            axios.get(users.all_users)
                .then(({ data }) => loadUsers(data.users))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadUsers, usersState, user]);

    useEffect(() => {
        if (!notificationsState.loaded && user) {
            axios.get(notifications.all_notifications(user._id))
                .then(({ data }) => loadNotifications(data.notifications))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadNotifications, notificationsState, user]);

    useEffect(() => {
        if (!tasksState.loaded && user) {
            axios.get(tasks.all_tasks(user._id))
                .then(({ data }) => loadTasks(data.tasks))
                .catch(error => console.log(".....API ERROR.....", error));
        }
    }, [loadTasks, tasksState, user]);
}

export default useLoadStates;