import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { GoHomeFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { RiTodoFill, RiCloseLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IoNotificationsSharp } from "react-icons/io5";

import Logo from "../assects/logo.png";

import { NotificationsContext } from '../store/NotificationContext';
import { AuthContext } from '../store/AuthContext';
import { UsersContext } from '../store/UsersContext';
import { TasksContext } from '../store/TasksContext';
import DeleteAccountModal from './DeleteAccountModal';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const { notificationsState, resetNotifications } = useContext(NotificationsContext);
    const { resetUsers } = useContext(UsersContext);
    const { resetTasks } = useContext(TasksContext);
    const [deleteModal, setDeleteModal] = useState(false);
    const [count, setCount] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        resetTasks();
        resetUsers();
        resetNotifications();
        logout();
    }

    const toggleDeleteModal = () => {
        setDeleteModal(prev => !prev);
    }

    useEffect(() => {
        setCount(notificationsState.notifications.filter(notification => !notification.read).length);
    }, [notificationsState]);

    return (
        <>
            {deleteModal && <DeleteAccountModal remove={toggleDeleteModal} handleLogout={handleLogout}/> }
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
                    <NavLink to='/notifications' className="button flex link gap2" title='Users'>
                        <IoNotificationsSharp />
                        <p>Notifications</p>
                        {count > 0 && <span className='notifications_count flex button primary round'>{count}</span>}
                    </NavLink>
                </div>
                <div className="flex col gap2 w_full">
                    <button className='button flex gap2 link' title='Logout' onClick={handleLogout}>
                        <TbLogout />
                        <p>Logout</p>
                    </button>
                    <button className='button flex gap2 link' title='Delete Account' onClick={toggleDeleteModal}>
                        <AiOutlineUserDelete />
                        <p>Delete Account</p>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;