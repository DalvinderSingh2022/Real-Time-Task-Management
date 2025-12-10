import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

import { AuthContext } from "../store/AuthContext";

const Layout = () => {
  const { authState } = useContext(AuthContext);

  if (!authState.authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <Toast />
      <Sidebar />
      <Topbar />
      <Outlet />
    </main>
  );
};

export default Layout;
