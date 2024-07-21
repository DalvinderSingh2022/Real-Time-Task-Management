import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/users.module.css';

import { AuthContext } from '../store/AuthContext';
import { SocketContext } from '../store/SocketContext';
import { AppContext } from '../store/AppContext';
import Response from './Response';
import AddTask from './AddTask';

const User = ({ name, followers, _id }) => {
    const [view, setView] = useState(false);
    const { authState } = useContext(AuthContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);
    const [following, setFollowing] = useState(false);
    const [response, setResponse] = useState(false);

    useEffect(() => {
        if (authState.authenticated) {
            setFollowing(authState.user.following.find(user => user._id === _id));
        }
    }, [authState, _id]);

    const handleFollow = () => {
        setResponse(true);
        axios.post(`http://localhost:4000/api/users/follow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                socketState.socket.emit('user_followed', data.authUser, data.userToFollow);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    const handleUnfollow = () => {
        setResponse(true);
        axios.post(`http://localhost:4000/api/users/unfollow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                socketState.socket.emit('user_unfollowed', data.authUser, data.userToUnfollow);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            {view && <AddTask assignedTo={_id} assignedBy={authState.user} remove={() => setView(false)} />}
            <div className={`flex ${styles.user}`}>
                <div>
                    <div className='text_primary' onClick={() => setView(true)}>{name}</div>
                    <div className='text_secondary'>Followers: {followers.length}</div>
                </div>
                {authState.user._id !== _id &&
                    (following
                        ? <button className='button secondary' onClick={handleUnfollow}>Unfollow</button>
                        : <button className='button primary' onClick={handleFollow}>follow</button>
                    )}
            </div>
        </>
    )
}

export default User;