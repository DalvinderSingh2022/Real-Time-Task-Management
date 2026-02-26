import React, { memo, useCallback, useContext, useMemo, useState } from "react";

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
  const [response, setResponse] = useState(false);
  const [show, setShow] = useState(false);

  const isSelf = authState.user._id === _id;

  const following = useMemo(() => {
    if (!authState.authenticated) return false;
    return authState.user.following.some((u) => u._id === _id);
  }, [authState.user.following, authState.authenticated, _id]);

  const handleFollow = useCallback(async () => {
    setResponse(true);
    try {
      const data = await users.follow(_id);
      const { authUser, userToFollow } = data;

      const notificationData = await notifications.followUser({
        authUser,
        userToFollow,
      });

      socket.emit(
        "user_followed",
        authUser,
        userToFollow,
        notificationData.notifications[0],
      );
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
  }, [_id, addToast]);

  const handleUnfollow = useCallback(async () => {
    setResponse(true);
    try {
      const data = await users.unfollow(_id);
      const { authUser, userToUnfollow } = data;

      const notificationData = await notifications.unfollowUser({
        authUser,
        userToUnfollow,
      });

      socket.emit(
        "user_unfollowed",
        authUser,
        userToUnfollow,
        notificationData.notifications[0],
      );
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
  }, [_id, addToast]);

  const handleClick = useCallback(() => {
    if (isSelf || authState.user.followers.some((f) => f._id === _id)) {
      setShow(true);
    } else {
      addToast({ type: "warning", message: `${name} doesn't follow You` });
    }
  }, [authState.user.followers, _id, isSelf, addToast, name]);

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
        {!isSelf &&
          (following ? (
            <button
              className="button secondary flex gap2"
              onClick={handleUnfollow}
            >
              Unfollow {response && <div className="loading"></div>}
            </button>
          ) : (
            <button className="button primary flex gap2" onClick={handleFollow}>
              Follow {response && <div className="loading"></div>}
            </button>
          ))}
      </div>
    </>
  );
};

export default memo(User);
