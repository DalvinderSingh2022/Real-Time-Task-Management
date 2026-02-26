import React, { lazy, Suspense, useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Loading from "./components/Loading";

import { AuthContext } from "./store/AuthContext";
import { AppContext } from "./store/AppContext";
import { DragAndDropProvider } from "./store/DragAndDropContext";
import { users } from "./utils/apiendpoints.js";

import useSocket from "./hooks/useSocket.js";
import useLoadStates from "./hooks/useLoadStates.js";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Users = lazy(() => import("./pages/Users/AllUsers"));
const Followers = lazy(() => import("./pages/Users/Followers"));
const Following = lazy(() => import("./pages/Users/Following"));
const Notfound = lazy(() => import("./pages/NotFound"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const Notifications = lazy(() => import("./pages/Notifications.js"));
const MagicLogin = lazy(() => import("./pages/MagicLogin.js"));

const App = () => {
  const { authState, login, logout, authCheckComplete } =
    useContext(AuthContext);

  const { addToast } = useContext(AppContext);
  useLoadStates(authState.user);
  useSocket();

  useEffect(() => {
    if (!authState.checkingAuth) return;

    const verifyUser = async () => {
      try {
        const data= await users.current();
        login(data.user);
      } catch (error) {
        logout();

        if (error?.response?.status !== 401) {
          addToast({
            type: "error",
            message: error?.message,
          });
          console.log(".....API ERROR.....", error);
        }
      } finally {
        authCheckComplete();
      }
    };

    verifyUser();
  }, [authState.checkingAuth, login, logout, authCheckComplete, addToast]);

  if (authState.checkingAuth) {
    return <Loading message="Fetching user details, please wait..." />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/magic-login/:token/:userId" element={<MagicLogin />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="tasks">
            <Route
              index
              element={
                <DragAndDropProvider>
                  <Tasks />
                </DragAndDropProvider>
              }
            />
            <Route path=":id" element={<TaskDetails />} />
          </Route>

          <Route path="users">
            <Route index element={<Users />} />
            <Route path="followers" element={<Followers />} />
            <Route path="following" element={<Following />} />
          </Route>

          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
