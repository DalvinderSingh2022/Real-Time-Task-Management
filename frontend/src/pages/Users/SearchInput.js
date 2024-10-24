import React from 'react';
import { NavLink } from 'react-router-dom';

import tasksStyles from "../../styles/tasks.module.css";

const SearchInput = ({ handleChange }) => {
    return (
        <form className={`${tasksStyles.filters} flex gap wrap`} onSubmit={e => e.preventDefault()}>
            <input
                type="search"
                name="q"
                placeholder='search by name'
                onChange={handleChange}
            />
            <div className="flex gap2">
                <NavLink end={true} to='/users' className='button flex gap2 link'>All</NavLink>
                <NavLink to='/users/followers' className='button flex gap2 link'>Followers</NavLink>
                <NavLink to='/users/following' className='button flex gap2 link'>Following</NavLink>
            </div>
        </form>);
}

export default SearchInput;