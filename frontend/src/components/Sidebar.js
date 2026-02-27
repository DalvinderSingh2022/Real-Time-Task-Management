import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { GoHomeFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { RiTodoFill, RiCloseLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IoNotificationsSharp } from "react-icons/io5";

import Logo from "../assects/logo.png";

import { NotificationsContext } from "../store/NotificationContext";
import { AuthContext } from "../store/AuthContext";
import { UsersContext } from "../store/UsersContext";
import { TasksContext } from "../store/TasksContext";
import DeleteAccountModal from "./DeleteAccountModal";
import { socket } from "../hooks/useSocket";

const Sidebar = () => {
  const { logout, authState } = useContext(AuthContext);
  const { resetNotifications, unreadCount } = useContext(NotificationsContext);
  const { resetUsers } = useContext(UsersContext);
  const { resetTasks } = useContext(TasksContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    resetTasks();
    resetUsers();
    resetNotifications();
    logout();

    socket.emit("user_left", authState.user._id);
  };

  useEffect(() => {
    if (collapsed) {
      document.querySelector("main").classList.add("close");
    } else {
      document.querySelector("main").classList.remove("close");
    }
  }, [collapsed]);

  return (
    <>
      {deleteModal && (
        <DeleteAccountModal
          remove={() => setDeleteModal(false)}
          handleLogout={handleLogout}
        />
      )}

      <aside className="side_nav flex col gap">
        <button
          className="menu_toggle button flex primary round"
          onClick={() => setCollapsed((p) => !p)}
        >
          <RiCloseLine />
        </button>
        <div className="side_nav_links flex col gap w_full">
          <div className="logo flex gap2" title="Task Manager">
            <img src={Logo} alt="task manager" className="logo_image" />
            <p>Task Manager</p>
          </div>
          <NavLink to="/" className="button flex link gap2" title="Home">
            <GoHomeFill />
            <p>Home</p>
          </NavLink>
          <NavLink
            to="/tasks"
            className="button flex link gap2"
            title="All Tasks"
          >
            <RiTodoFill />
            <p>All Tasks</p>
          </NavLink>
          <NavLink to="/users" className="button flex link gap2" title="Users">
            <FaUsers />
            <p>Users</p>
          </NavLink>
          <NavLink
            to="/notifications"
            className="button flex link gap2"
            title="Users"
          >
            <IoNotificationsSharp />
            <p>Notifications</p>
            {unreadCount > 0 && (
              <span className="notifications_count flex button primary round">
                {unreadCount}
              </span>
            )}
          </NavLink>
        </div>
        <div className="flex col gap2 w_full">
          <button className="button flex gap2 link" onClick={handleLogout}>
            <TbLogout />
            <p>Logout</p>
          </button>
          <button
            className="button flex gap2 link"
            onClick={() => setDeleteModal(true)}
          >
            <AiOutlineUserDelete />
            <p>Delete Account</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
