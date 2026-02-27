import React, { useContext, useState, useMemo } from "react";
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

  const formattedChange = useMemo(() => {
    if (prop.type !== "Task update") return null;

    const changes = prop.data.changes || {};
    const firstChange = Object.values(changes)[0] || {};

    let { field, oldValue, newValue } = firstChange;

    if (field === "dueDate") {
      oldValue = new Date(oldValue).toDateString();
      newValue = new Date(newValue).toDateString();
    }

    if (field === "assignedTo") {
      const formatUsers = (users) =>
        users
          .map((user) =>
            user._id === authState.user._id ? `${user.name}(You)` : user.name,
          )
          .join(", ");

      oldValue = formatUsers(oldValue);
      newValue = formatUsers(newValue);
    }

    return { field, oldValue, newValue };
  }, [prop.type, prop.data.changes, authState.user._id]);

  const createdAt = useMemo(() => {
    const date = new Date(prop.createdAt);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
  }, [prop.createdAt]);

  const task = prop.data.task;

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
            to={`/tasks?q=${task?.title}`}
            className={`text_primary ${styles.message}`}
          >
            {prop.message}
          </Link>
        )}
        <div className={styles.data}>
          {prop.type === "Task update" && formattedChange ? (
            <>
              <div>
                {formattedChange.field?.charAt(0).toUpperCase() +
                  formattedChange.field?.slice(1)}
              </div>
              <div>OldValue: {formattedChange.oldValue}</div>
              <div>NewValue: {formattedChange.newValue}</div>
            </>
          ) : (
            <>
              <div className="text_primary">Title: {task?.title}</div>
              {prop.type === "Task assignment" && (
                <div className="text_primary">
                  Due Date: {new Date(task?.dueDate).toDateString()}
                </div>
              )}
              {prop.type === "Task deleted" && (
                <div className="text_primary">
                  Description: {task?.description}
                </div>
              )}
            </>
          )}
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

export default TaskNotification;
