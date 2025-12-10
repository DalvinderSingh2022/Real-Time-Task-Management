import React, { memo, useState } from "react";

import { RiUserUnfollowLine } from "react-icons/ri";
import { RiUserFollowLine } from "react-icons/ri";

import styles from "../../styles/notifications.module.css";
import DeleteButton from "./DeleteButton";
import { Link } from "react-router-dom";

const UserNotification = (prop) => {
  const [response, setResponse] = useState(false);

  return (
    <>
      <div className={`${styles.icon} button round flex`}>
        {prop.type === "User follow" ? (
          <RiUserUnfollowLine />
        ) : (
          <RiUserFollowLine />
        )}
      </div>
      <div className="w_full">
        <div className={`text_primary ${styles.message}`}>{prop.message}</div>
        <Link to={`/users?q=${prop.data.user.name}`}>
          {prop.data.user.name}
        </Link>
        <div className={styles.data}>
          <div className="text_secondary">
            {new Date(prop.createdAt).toDateString() +
              " at " +
              new Date(prop.createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
      {response ? (
        <div className="loading"></div>
      ) : (
        <DeleteButton
          response={response}
          setResponse={setResponse}
          prop={prop}
        />
      )}
    </>
  );
};

export default memo(
  UserNotification,
  (prev, next) => prev?.data?.task?._id === next?.data?.task?._id
);
