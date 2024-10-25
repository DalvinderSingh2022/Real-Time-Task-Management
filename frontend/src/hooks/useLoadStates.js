import { useContext, useEffect } from 'react'
import axios from 'axios';

import { TasksContext } from '../store/TasksContext';
import { UsersContext } from '../store/UsersContext';
import { NotificationsContext } from '../store/NotificationContext';

const useLoadStates = (user) => {
    const { loadTasks, tasksState } = useContext(TasksContext);
    const { loadUsers, usersState } = useContext(UsersContext);
    const { loadNotifications, notificationsState } = useContext(NotificationsContext);

    useEffect(() => {
        if (!usersState.loaded && user) {
            axios.get("https://task-manager-v4zl.onrender.com/api/users/all")
                .then(({ data }) => loadUsers(data.users))
                .catch(err => console.error(err));
        }
    }, [loadUsers, usersState, user]);

    useEffect(() => {
        if (!notificationsState.loaded && user) {
            axios.get(`https://task-manager-v4zl.onrender.com/api/notifications/all/${user._id}`)
                .then(({ data }) => loadNotifications(data.notifications))
                .catch(err => console.error(err));
        }
    }, [loadNotifications, notificationsState, user]);

    useEffect(() => {
        if (!tasksState.loaded && user) {
            axios.get(`https://task-manager-v4zl.onrender.com/api/tasks/all/${user._id}`)
                .then(({ data }) => loadTasks(data.tasks))
                .catch(err => console.error(err));
        }
    }, [loadTasks, tasksState, user]);
}

export default useLoadStates;