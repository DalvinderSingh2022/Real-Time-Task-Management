import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import { GoHomeFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { RiTodoFill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import { RiCloseLine } from "react-icons/ri";

import { AuthContext } from '../store/AuthContext';

const Sidebar = () => {
    const { logout, authState } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        logout();
    }

    const handleDelete = () => {
        axios.delete(`http://localhost:4000/api/users/${authState.user.id}`)
            .then(() => handleLogout())
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <aside className='side_nav flex col gap'>
            <button className='menu_toggle button flex primary round' onClick={() => document.querySelector("main").classList.toggle('close')}>
                <RiCloseLine />
            </button>
            <div className="side_nav_links flex col gap w_full">
                <div className='logo'>Task Manager</div>
                <NavLink to='/' className="button flex link gap2">
                    <GoHomeFill />
                    <p>Home</p>
                </NavLink>
                <NavLink to='/tasks' className="button flex link gap2">
                    <RiTodoFill />
                    <p>All Tasks</p>
                </NavLink>
                <NavLink to='/users' className="button flex link gap2">
                    <FaUsers />
                    <p>Users</p>
                </NavLink>
            </div>
            <div className="flex col gap2 w_full">
                <button className='button flex gap2 link' onClick={handleLogout}>
                    <TbLogout />
                    <p>Logout</p>
                </button>
                <button className='button flex gap2 link' onClick={handleDelete}>
                    <AiOutlineUserDelete />
                    <p>Delete Account</p>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;