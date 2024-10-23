import React, { useContext, useEffect, useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import { NotificationsContext } from '../store/NotificationContext';
import TaskAssign from '../components/Notifications/TaskAssign';
import TaskUpdate from '../components/Notifications/TaskUpdate';
import FollowUser from '../components/Notifications/FollowUser';
import UnfollowUser from '../components/Notifications/UnfollowUser';

const NotificationTypes = {
    TASK_ASSIGNMENT: (props) => <TaskAssign {...props} />,
    TASK_UPDATE: (props) => <TaskUpdate {...props} />,
    FOLLOW: (props) => <FollowUser {...props} />,
    UNFOLLOW: (props) => <UnfollowUser {...props} />,
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
                            {NotificationTypes[notification.type] ? NotificationTypes[notification.type](notification) : <></>}
                        </div>
                    )) : notificationsState ? <div className='text_secondary flex'>There is no Notifications</div> : <div className='loading'></div>}
            </div>
        </article>
    )
}

export default Notifications;