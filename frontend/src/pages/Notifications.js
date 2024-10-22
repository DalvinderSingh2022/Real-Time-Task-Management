import React, { useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import TaskAssign from '../components/Notifications/TaskAssign';

const NotificationTypes = {
    TASK_UPDATE: <></>,
    COMMENT: <></>,
    FOLLOW: <></>,
    UNFOLLOW: <></>,
    TASK_ASSIGNMENT: (props) => <TaskAssign {...props} />,
    TASK_COMPLETION: <></>,
    // DUE_DATE_REMINDER: 'due_date_reminder',
    // USER_MENTION: 'user_mention',
    // SYSTEM_ALERT: 'system_alert',
};

const Notifications = () => {
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
                {NotificationTypes.TASK_ASSIGNMENT({ title: 'dsd' })}
            </div>
        </article>
    )
}

export default Notifications;