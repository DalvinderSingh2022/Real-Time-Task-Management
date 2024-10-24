import React, { useContext, useEffect, useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import { NotificationsContext } from '../store/NotificationContext';
import TaskNotification from '../components/Notifications/TaskNotification';
import UserNotification from '../components/Notifications/UserNotification';

const NotificationTypes = {
    TASK_NOTIFICATION: (prop) => <TaskNotification {...prop} />,
    USER_NOTIFICATION: (prop) => <UserNotification {...prop} />,
};

const Notifications = () => {
    const { notificationsState } = useContext(NotificationsContext);
    const [notifications, setNotifications] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!notificationsState.loaded) return;

        setNotifications(notificationsState.notifications.filter(notification =>
            notification.message.toLowerCase().replaceAll(" ", '').includes(search)
        ));
    }, [notificationsState, search]);

    return (
        <article>
            <form className={`${tasksStyles.filters} flex gap wrap`} onSubmit={e => e.preventDefault()}>
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder='search by title'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </form>
            <div className='flex col gap'>
                {notifications?.length
                    ? (notifications.map(notification =>
                        <div className={`${styles.notification} ${notification.read ? "" : styles.unread} flex gap`} title={notification.type} key={notification._id}>
                            {notification.type.startsWith('TASK') && NotificationTypes.TASK_NOTIFICATION(notification)}
                            {notification.type.startsWith('USER') && NotificationTypes.USER_NOTIFICATION(notification)}
                        </div>
                    )) : notificationsState ? <div className='text_secondary flex'>There is no Notifications</div> : <div className='loading'></div>}
            </div>
        </article>
    )
}

export default Notifications;