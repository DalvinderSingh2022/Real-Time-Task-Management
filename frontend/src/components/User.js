import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/users.module.css';

import { AuthContext } from '../store/AuthContext';
import { UsersContext } from '../store/UsersContext';

const User = ({ name, followers, _id }) => {
    const { authState, login } = useContext(AuthContext);
    const { updateUser } = useContext(UsersContext);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        if (authState.authenticated) {
            setFollowing(authState.user.following.find(user => user._id === _id));
        }
    }, [authState, _id]);

    const handleFollow = () => {
        axios.post(`http://localhost:4000/api/users/follow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                updateUser(data.data.authUser);
                updateUser(data.data.userToFollow);
                login(data.data.authUser);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleUnfollow = () => {
        axios.post(`http://localhost:4000/api/users/unfollow/${_id}`, { userId: authState.user._id })
            .then(({ data }) => {
                updateUser(data.data.authUser);
                updateUser(data.data.userToUnfollow);
                login(data.data.authUser);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className={`flex ${styles.user}`}>
            <div>
                <div className='text_primary'>{name}</div>
                <div className='text_secondary'>Followers: {followers.length}</div>
            </div>
            {authState.user._id !== _id &&
                (following
                    ? <button className='button secondary' onClick={handleUnfollow}>Unfollow</button>
                    : <button className='button primary' onClick={handleFollow}>follow</button>
                )}
        </div>
    )
}

export default User;