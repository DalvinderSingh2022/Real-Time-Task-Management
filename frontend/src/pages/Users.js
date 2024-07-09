import React, { useState } from 'react';

import tasksStyles from "../styles/tasks.module.css";

const Users = () => {
    const [search, setSearch] = useState('');
    const [filter, SetFilter] = useState('all');
    // const [users, setUsers] = useState(null);

    const changeFilter = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            return;
        }

        SetFilter(e.target.getAttribute('data-filter'));
    }

    return (
        <article>
            <form className={`${tasksStyles.filters}`} onClick={e => changeFilter(e)}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='search by name'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type='button' data-filter='all' className={`${filter === "all" ? "primary" : "secondary"} button flex gap2`}>All</button>
                <button type='button' data-filter='followers' className={`${filter === "followers" ? "primary" : "secondary"} button flex gap2`}>Followers</button>
                <button type='button' data-filter='following' className={`${filter === "following" ? "primary" : "secondary"} button flex gap2`}>Following</button>
            </form>
        </article >
    )
}

export default Users;