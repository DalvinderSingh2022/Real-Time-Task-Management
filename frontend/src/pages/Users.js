import React, { useContext, useEffect, useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/users.module.css";

import { AuthContext } from '../store/AuthContext';
import { UsersContext } from '../store/UsersContext';
import User from '../components/User';

const Users = () => {
    const { authState } = useContext(AuthContext);
    const { usersState } = useContext(UsersContext);
    const [search, setSearch] = useState('');
    const [filter, SetFilter] = useState('');
    const [users, setUsers] = useState(null);

    const changeFilter = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            return;
        }

        SetFilter(e.target.getAttribute('data-filter') || '');
    }

    useEffect(() => {
        if (!authState.authenticated || !usersState.loaded) {
            return;
        }

        if (filter === "followers") {
            setUsers(authState.user.followers.filter(user => user.name.toLowerCase().replaceAll(" ", '').includes(search)));
        } else if (filter === "following") {
            setUsers(authState.user.following.filter(user => user.name.toLowerCase().replaceAll(" ", '').includes(search)));
        } else {
            setUsers(usersState.users.filter(user => user.name.toLowerCase().replaceAll(" ", '').includes(search)));
        }
    }, [filter, authState, usersState, search]);

    return (
        <article>
            <form className={`${tasksStyles.filters} ${tasksStyles.wrap}`} onClick={e => changeFilter(e)}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='search by name'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type='button' className={`${filter === "" ? "primary" : "secondary"} button flex gap2`}>All</button>
                <button type='button' data-filter='followers' className={`${filter === "followers" ? "primary" : "secondary"} button flex gap2`}>Followers</button>
                <button type='button' data-filter='following' className={`${filter === "following" ? "primary" : "secondary"} button flex gap2`}>Following</button>
            </form>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    {users?.length > 0
                        ? users.map(user => <User {...user} key={user._id} />)
                        : (users?.length !== 0 ? <div className="loading"></div> : <div>There is no user in {filter ? filter : ""}</div>)
                    }
                </div>
            </div>
        </article >
    )
}

export default Users;