import React, { memo, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/users.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { socket } from '../hooks/useSocket';
import { notifications, users } from '../utils/apiendpoints';
import AddTask from './AddTask';
import Response from './Response';

const User = ({ name, followers, _id }) => {
    const { authState } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const [following, setFollowing] = useState(false);
    const [response, setResponse] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (authState.authenticated) {
            setFollowing(authState.user.following.find(user => user._id === _id));
        }
    }, [authState, _id]);

    const handleFollow = () => {
        setResponse(true);
        axios.post(users.follow_user(_id), { userId: authState.user._id })
            .then(({ data }) => {
                const { authUser, userToFollow } = data;

                axios.post(notifications.follow_user, { authUser, userToFollow })
                    .then(({ data: notificationData }) => {
                        const [notification] = notificationData.notifications;
                        socket.emit('user_followed', authUser, userToFollow, notification);
                    });
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message });
                console.log(".....API ERROR....." + error);
            })
            .finally(() => setResponse(false));
    }

    const handleUnfollow = () => {
        setResponse(true);
        axios.post(users.unfollow_user(_id), { userId: authState.user._id })
            .then(({ data }) => {
                const { authUser, userToUnfollow } = data;

                axios.post(notifications.unfollow_user, { authUser, userToUnfollow })
                    .then(({ data: notificationData }) => {
                        const [notification] = notificationData.notifications;
                        socket.emit('user_unfollowed', authUser, userToUnfollow, notification);
                    });
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message });
                console.log(".....API ERROR....." + error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            {show && <AddTask remove={() => setShow(false)} assignedTo={_id} />}
            <div className={`flex ${styles.user}`} title={name}>
                <div>
                    <div onClick={() => setShow(true)} className={`text_primary ${styles.user_title}`}>{name}</div>
                    <div className='text_secondary'>Followers: {followers.length}</div>
                </div>
                {authState.user._id !== _id &&
                    (following
                        ? <button className='button secondary flex gap2' onClick={handleUnfollow}>Unfollow {response && <div className='loading'></div>}</button>
                        : <button className='button primary flex gap2' onClick={handleFollow}>Follow{response && <div className='loading'></div>}</button>
                    )}
            </div>
        </>
    )
}

export default memo(User, (prev, next) => prev?._id === next?._id);