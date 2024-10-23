import React, { memo, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/users.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { socket } from '../App';
import Response from './Response';
import AddTask from './AddTask';

const User = ({ name, followers, _id }) => {
    const { authState } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const [following, setFollowing] = useState(false);
    const [response, setResponse] = useState(false);
    const [addTask, setAddTask] = useState(false);

    useEffect(() => {
        if (authState.authenticated) {
            setFollowing(authState.user.following.find(user => user._id === _id));
        }
    }, [authState, _id]);

    const handleFollow = () => {
        setResponse(true);
        axios.post(`https://task-manager-v4zl.onrender.com/api/users/follow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                socket.emit('user_followed', data.authUser, data.userToFollow);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    const handleUnfollow = () => {
        setResponse(true);
        axios.post(`https://task-manager-v4zl.onrender.com/api/users/unfollow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                socket.emit('user_unfollowed', data.authUser, data.userToUnfollow);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            {addTask && <AddTask assignedTo={_id} remove={() => setAddTask(false)} />}
            <div className={`flex ${styles.user}`} title={name}>
                <div>
                    {authState.user.followers.find(user => user._id === _id)
                        ? <div className={`text_primary ${styles.user_title}`} style={{ cursor: 'pointer' }} onClick={() => setAddTask(true)} >{name}</div>
                        : <div className={`text_primary ${styles.user_title}`}>{name}</div>}
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