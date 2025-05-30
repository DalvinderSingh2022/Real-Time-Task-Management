import React, { useContext } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import { NotificationsContext } from '../store/NotificationContext';
import SystemNotifiaction from '../components/Notifications/SystemNotifiaction';
import TaskNotification from '../components/Notifications/TaskNotification';
import UserNotification from '../components/Notifications/UserNotification';
import useSearch from '../hooks/useSearch';

const NOTIFICATION = {
    TASK: (prop) => <TaskNotification {...prop} />,
    USER: (prop) => <UserNotification {...prop} />,
    SYSTEM: (prop) => <SystemNotifiaction {...prop} />,
};

const NotificationTypes = ['Task update', 'Task deleted', 'Task assignment', 'User follow', 'User unfollow', 'Due date reminder'];

const Notifications = () => {
    const { notificationsState } = useContext(NotificationsContext);
    const [handleChange, notifications, query] = useSearch(notificationsState.notifications, 'message', 'type');

    return (
        <article>
            <SearchInput handleChange={handleChange} query={query} />
            <div className='flex col gap'>
                {notifications?.length
                    ? (notifications.map(notification =>
                        <div className={`${styles.notification} ${notification.read ? "" : styles.unread} flex gap`} title={notification.type} key={notification._id}>
                            {notification.type.startsWith('Task') && NOTIFICATION.TASK(notification)}
                            {notification.type.startsWith('User') && NOTIFICATION.USER(notification)}
                            {notification.type.startsWith('Due') && NOTIFICATION.SYSTEM(notification)}
                        </div>
                    )) : notificationsState ? <div className='text_secondary flex'>There is no Notifications</div> : <div className='loading'></div>}
            </div>
        </article>
    )
}

const SearchInput = ({ handleChange, query }) => {
    return <form className={`${tasksStyles.filters} flex gap wrap`} onSubmit={e => e.preventDefault()}>
        <input
            type="search"
            name="q"
            value={query.get('q') || ''}
            placeholder='search by title'
            onChange={handleChange}
        />
        <select
            defaultValue={query.get('type') || ''}
            onChange={handleChange}
            name='type'
            className='button primary'
        >
            <option value=''>All</option>
            {NotificationTypes.map(notification => <option key={notification} value={notification}>{notification}</option>)}
        </select>
    </form>
}

export default Notifications;