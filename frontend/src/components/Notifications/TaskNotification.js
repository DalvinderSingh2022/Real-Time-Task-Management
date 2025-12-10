import React, { memo, useContext, useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineNoteAdd } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { CgFileRemove } from "react-icons/cg";

import styles from "../../styles/notifications.module.css";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../../store/AuthContext";

const icons = {
  "Task update": <VscGitPullRequestGoToChanges />,
  "Task deleted": <CgFileRemove />,
  "Task assignment": <MdOutlineNoteAdd />,
};

const TaskNotification = (prop) => {
  const [response, setResponse] = useState(false);
  const { authState } = useContext(AuthContext);
  const { title, description, dueDate, assignedTo, status } =
    prop.data.changes || prop.data.task;
  const notificationData =
    title || description || dueDate || status || assignedTo;
  let { field, oldValue, newValue } = notificationData;

  if (field === "dueDate") {
    oldValue = new Date(oldValue).toDateString();
    newValue = new Date(newValue).toDateString();
  } else if (field === "assignedTo") {
    oldValue = oldValue
      .map(
        (user) => (user.name += user._id !== authState.user._id ? "" : "(You)")
      )
      .join(", ");
    newValue = newValue
      .map(
        (user) => (user.name += user._id !== authState.user._id ? "" : "(You)")
      )
      .join(", ");
  }

  return (
    <>
      <div className={`${styles.icon} button round flex`}>
        {icons[prop.type]}
      </div>
      <div className="w_full">
        {prop.type === "Task deleted" ? (
          <div className={`text_primary ${styles.message}`}>{prop.message}</div>
        ) : (
          <Link
            to={`/tasks?q=${prop.data.task.title}`}
            className={`text_primary ${styles.message}`}
          >
            {prop.message}
          </Link>
        )}
        <div className={styles.data}>
          {prop.type === "Task update" ? (
            <>
              <div>{field.slice(0, 1).toUpperCase() + field.slice(1)}</div>
              <div>OldValue: {oldValue}</div>
              <div>NewValue: {newValue}</div>
            </>
          ) : (
            <>
              <div className="text_primary">Title: {title}</div>
              {prop.type === "Task assignment" && (
                <div className="text_primary">
                  Due Date: {new Date(dueDate).toDateString()}
                </div>
              )}
              {prop.type === "Task deleted" && (
                <div className="text_primary">Description: {description}</div>
              )}
            </>
          )}
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
        prop && (
          <DeleteButton
            response={response}
            setResponse={setResponse}
            prop={prop}
          />
        )
      )}
    </>
  );
};

export default memo(
  TaskNotification,
  (prev, next) => prev?.data?.task?._id === next?.data?.task?._id
);
