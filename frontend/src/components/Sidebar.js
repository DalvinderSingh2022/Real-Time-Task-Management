import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import { GoHomeFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { RiTodoFill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import { RiCloseLine } from "react-icons/ri";

import Logo from "../assects/logo.png";

import Response from './Response';
import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { UsersContext } from '../store/UsersContext';
import { TasksContext } from '../store/TasksContext';

const Sidebar = () => {
    const { authState, logout } = useContext(AuthContext);
    const { resetUsers } = useContext(UsersContext);
    const { resetTasks } = useContext(TasksContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        resetTasks();
        resetUsers();
        logout();
    }

    const handleDelete = () => {
        setResponse(true);
        axios.delete(`http://localhost:4000/api/users/${authState.user._id}`)
            .then(() => handleLogout())
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            <aside className='side_nav flex col gap'>
                <button className='menu_toggle button flex primary round' onClick={() => document.querySelector("main").classList.toggle('close')}>
                    <RiCloseLine />
                </button>
                <div className="side_nav_links flex col gap w_full">
                    <div className='logo flex gap2' title='Task Manager'>
                        <img src={Logo} alt="task manager" className='logo_image' />
                        <p>Task Manager</p>
                    </div>
                    <NavLink to='/' className="button flex link gap2" title='Home'>
                        <GoHomeFill />
                        <p>Home</p>
                    </NavLink>
                    <NavLink to='/tasks' className="button flex link gap2" title='All Tasks'>
                        <RiTodoFill />
                        <p>All Tasks</p>
                    </NavLink>
                    <NavLink to='/users' className="button flex link gap2" title='Users'>
                        <FaUsers />
                        <p>Users</p>
                    </NavLink>
                </div>
                <div className="flex col gap2 w_full">
                    <button className='button flex gap2 link' title='Logout' onClick={handleLogout}>
                        <TbLogout />
                        <p>Logout</p>
                    </button>
                    <button className='button flex gap2 link' title='Delete Account' onClick={handleDelete}>
                        <AiOutlineUserDelete />
                        <p>Delete Account</p>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;