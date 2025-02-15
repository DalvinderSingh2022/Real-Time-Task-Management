import React, { memo, useContext, useEffect } from 'react';

import { IoCloseSharp } from "react-icons/io5";

import { NotificationsContext } from '../../store/NotificationContext';
import { AppContext } from '../../store/AppContext';
import { notifications } from '../../utils/apiendpoints';
import Response from '../Response';

const DeleteButton = ({ response, setResponse, prop }) => {
    const { notificationsState, readNotification, deleteNotification } = useContext(NotificationsContext);
    const { addToast } = useContext(AppContext);

    useEffect(() => {
        const notification = notificationsState.notifications.find(notification => notification._id === prop._id);

        const handleNotification = () => {
            if (notification && !notification.read) {
                notifications.update(prop._id, { ...notification, read: true })
                    .then(({ data }) => readNotification(data.notification._id))
                    .catch(error => console.log(".....API ERROR.....", error));
            }
        }

        return () => handleNotification();
    }, [notificationsState, readNotification, prop]);

    const handleDelete = () => {
        setResponse(true);
        notifications.delete(prop._id)
            .then(() => deleteNotification(prop._id))
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message });
                console.log(".....API ERROR.....", error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            <button className='button round flex text_primary' title='Delete' onClick={handleDelete}><IoCloseSharp /></button>
        </>
    )
}

export default memo(DeleteButton, (prev, next) => prev?.prop?._id && prev?.prop?._id === next?.prop?._id);