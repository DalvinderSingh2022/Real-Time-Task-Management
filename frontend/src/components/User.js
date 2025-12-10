import React, { useContext, useEffect, useState } from "react";

import styles from "../styles/users.module.css";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { socket } from "../hooks/useSocket";
import { notifications, users } from "../utils/apiendpoints";
import AddTask from "./AddTask";
import Response from "./Response";

const User = ({ name, followers, _id, avatar }) => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);
  const [following, setFollowing] = useState(false);
  const [response, setResponse] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (authState.authenticated) {
      setFollowing(authState.user.following.some((user) => user._id === _id));
    }
  }, [authState, _id]);

  const handleFollow = async () => {
    setResponse(true);
    try {
      const { data } = await users.follow(_id);
      const { authUser, userToFollow } = data;

      const { data: notificationData } = await notifications.followUser({
        authUser,
        userToFollow,
      });
      const [notification] = notificationData.notifications;
      socket.emit("user_followed", authUser, userToFollow, notification);
    } catch (error) {
      addToast({
        type: "error",
        message: error?.response?.data?.message || error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
  };

  const handleUnfollow = async () => {
    setResponse(true);
    try {
      const { data } = await users.unfollow(_id);
      const { authUser, userToUnfollow } = data;

      const { data: notificationData } = await notifications.unfollowUser({
        authUser,
        userToUnfollow,
      });
      const [notification] = notificationData.notifications;
      socket.emit("user_unfollowed", authUser, userToUnfollow, notification);
    } catch (error) {
      addToast({
        type: "error",
        message: error?.response?.data?.message || error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
  };

  const handleClick = () => {
    authState.user._id === _id ||
    authState.user.followers.some((follower) => follower._id === _id)
      ? setShow(true)
      : addToast({ type: "warning", message: `${name} doesn't follow You` });
  };

  return (
    <>
      {response && <Response />}
      {show && (
        <AddTask remove={() => setShow(false)} initialAssignedTo={[_id]} />
      )}
      <div className={`flex ${styles.user}`} title={name}>
        <div className="flex gap2">
          <img src={avatar} alt="User Avatar" className="avatar" />
          <div>
            <div
              onClick={handleClick}
              className={`text_primary ${styles.user_title}`}
            >
              {name}
            </div>
            <div className="text_secondary">Followers: {followers.length}</div>
          </div>
        </div>
        {authState.user._id !== _id &&
          (following ? (
            <button
              className="button secondary flex gap2"
              onClick={handleUnfollow}
            >
              Unfollow {response && <div className="loading"></div>}
            </button>
          ) : (
            <button className="button primary flex gap2" onClick={handleFollow}>
              Follow{response && <div className="loading"></div>}
            </button>
          ))}
      </div>
    </>
  );
};

export default User;
