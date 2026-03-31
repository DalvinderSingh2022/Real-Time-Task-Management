import React, { memo, useState, useMemo } from "react";

import { RiUserUnfollowLine } from "react-icons/ri";
import { RiUserFollowLine } from "react-icons/ri";

import styles from "../../styles/notifications.module.css";
import DeleteButton from "./DeleteButton";
import { Link } from "react-router-dom";

const icons = {
  "User follow": <RiUserUnfollowLine />,
  "User unfollow": <RiUserFollowLine />,
};

const UserNotification = (prop) => {
  const [response, setResponse] = useState(false);

  const createdAt = useMemo(() => {
    const date = new Date(prop.createdAt);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
  }, [prop.createdAt]);

  const userName = prop.data?.user?.name;

  return (
    <>
      <div className={`${styles.icon} button round flex`}>
        {icons[prop.type]}
      </div>
      <div className="w_full">
        <div className={`text_primary ${styles.message}`}>{prop.message}</div>
        <Link to={`/users?q=${userName}`}>{userName}</Link>
        <div className={styles.data}>
          <div className="text_secondary">{createdAt}</div>
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

export default memo(UserNotification);
