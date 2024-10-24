import React, { useContext, useEffect, useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import { NotificationsContext } from '../store/NotificationContext';
import TaskNotification from '../components/Notifications/TaskNotification';
import UserNotification from '../components/Notifications/UserNotification';

const NOTIFICATION = {
    TASK: (prop) => <TaskNotification {...prop} />,
    USER: (prop) => <UserNotification {...prop} />,
};

const NotificationTypes = ['TASK_UPDATE', 'TASK_DELETED', 'TASK_ASSIGNMENT', 'USER_FOLLOW', 'USER_UNFOLLOW'];

const Notifications = () => {
    const { notificationsState } = useContext(NotificationsContext);
    const [notifications, setNotifications] = useState(null);
    const [filter, SetFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!notificationsState.loaded) return;

        setNotifications(notificationsState.notifications.filter(notification =>
            (filter === 'ALL' || notification.type === filter) &&
            notification.message.toLowerCase().replaceAll(" ", '').includes(search)
        ));
    }, [notificationsState, search, filter]);

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
                <select
                    defaultValue={'ALL'}
                    onChange={(e) => SetFilter(e.target.value)}
                    className='button primary'
                >
                    <option value={'ALL'}>All</option>
                    {NotificationTypes.map(notification => <option key={notification} value={notification}>{notification.at(0) + notification.slice(1).toLowerCase().replace("_", " ")}</option>)}
                </select>
            </form>
            <div className='flex col gap'>
                {notifications?.length
                    ? (notifications.map(notification =>
                        <div className={`${styles.notification} ${notification.read ? "" : styles.unread} flex gap`} title={notification.type} key={notification._id}>
                            {notification.type.startsWith('TASK') && NOTIFICATION.TASK(notification)}
                            {notification.type.startsWith('USER') && NOTIFICATION.USER(notification)}
                        </div>
                    )) : notificationsState ? <div className='text_secondary flex'>There is no Notifications</div> : <div className='loading'></div>}
            </div>
        </article>
    )
}

export default Notifications;