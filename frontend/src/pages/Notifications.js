import React, { useContext, useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import TaskAssign from '../components/Notifications/TaskAssign';
import { NotificationsContext } from '../store/NotificationContext';

const NotificationTypes = {
    TASK_ASSIGNMENT: (props) => <TaskAssign {...props} />
};

const Notifications = () => {
    const { notificationsState } = useContext(NotificationsContext);
    const [search, setSearch] = useState('');

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
                {notificationsState.notifications.length
                    ? (notificationsState.notifications.map(notification =>
                        <div className={`${styles.notification} ${notification.read ? "" : styles.unread} flex gap`} title={notification.type} key={notification._id}>
                            {NotificationTypes[notification.type] ? NotificationTypes[notification.type](notification) : <></>}
                        </div>
                    )) : notificationsState.loaded ? <div className='text_secondary flex'>There is no Notifications</div> : <div className='loading'></div>}
            </div>
        </article>
    )
}

export default Notifications;