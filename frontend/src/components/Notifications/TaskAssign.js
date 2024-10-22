import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { IoCloseSharp } from "react-icons/io5";
import { MdNoteAdd } from "react-icons/md";

import styles from "../../styles/notifications.module.css";
import axios from 'axios';

import { NotificationsContext } from '../../store/NotificationContext';
import { AppContext } from '../../store/AppContext';
import Response from '../Response';

const TaskAssign = (notification) => {
    const [response, setResponse] = useState(false);
    const { notificationsState, readNotification, deleteNotification } = useContext(NotificationsContext);
    const { addToast } = useContext(AppContext);
    const { title, description, dueDate } = notification.data.task;

    useEffect(() => {
        const notifi = notificationsState.notifications.find(notifi => notifi._id === notification._id);

        if (notifi && !notifi.read) {
            axios.put(`https://task-manager-v4zl.onrender.com/api/notifications/${notification._id}`, { ...notification, read: true })
                .then(({ data }) => {
                    readNotification(data.updatedNotification._id);
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }, [notificationsState, readNotification, notification]);

    const handleDelete = () => {
        setResponse(true);
        axios.delete(`https://task-manager-v4zl.onrender.com/api/notifications/${notification._id}`)
            .then(() => {
                deleteNotification(notification._id);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message });
                console.error(error);
            })
            .finally(() => setResponse(''));
    }

    return (
        <>
            {response && <Response />}
            <div className={`${styles.icon} button round flex`}><MdNoteAdd /></div>
            <div className="w_full">
                <Link to={`/tasks/${'smsm'}`} className={`text_primary ${styles.message}`}>{notification.message}</Link>
                <div className={styles.data}>
                    <div className='text_secondary'>Title: {title}</div>
                    <div className='text_secondary'>Description: {description}</div>
                    <div className='text_secondary'>Duedate: {new Date(dueDate).toDateString()}</div>
                </div>
            </div>
            {response
                ? <div className='loading'></div>
                : <button className='button round flex text_primary' title='Delete' onClick={handleDelete}><IoCloseSharp /></button>}
        </>
    )
}

export default TaskAssign;