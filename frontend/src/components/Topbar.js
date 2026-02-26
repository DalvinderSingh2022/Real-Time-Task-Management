import React, { memo, useContext, useMemo, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";

import { AuthContext } from "../store/AuthContext";
import UpdateProfile from "./UpdateProfile";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Topbar = () => {
  const [show, setShow] = useState(false);
  const { authState } = useContext(AuthContext);

  const greeting = useMemo(() => getGreeting(), []);

  const toggleSidebar = () => {
    document.querySelector("main")?.classList.toggle("close");
  };

  return (
    <>
      {show && <UpdateProfile remove={() => setShow(false)} />}
      <nav className="top_nav flex">
        <div className="flex gap">
          <button
            className="menu_toggle button flex primary round"
            onClick={toggleSidebar}
          >
            <CgMenuRightAlt />
          </button>
          <div className="greeting text_primary">Welcome, {greeting}</div>
        </div>
        <div className="user_profile flex gap2">
          <img
            onClick={() => setShow(true)}
            src={authState.user.avatar}
            alt="User Avatar"
            className="avatar"
          />
          <div className="flex col">
            <div className="name">{authState.user.name}</div>
            <div className="email">{authState.user.email}</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(Topbar);
