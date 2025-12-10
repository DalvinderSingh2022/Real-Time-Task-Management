import React, { memo, useState } from "react";

import { TbCalendarDue } from "react-icons/tb";

import styles from "../../styles/notifications.module.css";
import DeleteButton from "./DeleteButton";
import { Link } from "react-router-dom";

const SystemNotification = (prop) => {
  const [response, setResponse] = useState(false);
  const tasks = prop.data.tasks;

  return (
    <>
      <div className={`${styles.icon} button round flex`}>
        <TbCalendarDue />
      </div>
      <div className="w_full">
        <span className={`text_primary ${styles.message}`}>{prop.message}</span>
        <div className={styles.data}>
          <Link to={`/tasks?dueStatus=Due Today`}>
            {tasks.map(
              (task, index) => `${index !== 0 ? "," : ""}${task.title}`
            )}
          </Link>
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
  SystemNotification,
  (prev, next) => prev?.data?.task?._id === next?.data?.task?._id
);
