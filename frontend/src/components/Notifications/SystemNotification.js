import React, { memo, useState, useMemo } from "react";
import { TbCalendarDue } from "react-icons/tb";
import { Link } from "react-router-dom";

import styles from "../../styles/notifications.module.css";
import DeleteButton from "./DeleteButton";

const SystemNotification = (prop) => {
  const [response, setResponse] = useState(false);

  const taskTitles = useMemo(
    () => prop.data.tasks.map((t) => t.title).join(", "),
    [prop.data.tasks],
  );

  const createdAt = useMemo(() => {
    const date = new Date(prop.createdAt);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
  }, [prop.createdAt]);

  return (
    <>
      <div className={`${styles.icon} button round flex`}>
        <TbCalendarDue />
      </div>
      <div className="w_full">
        <span className={`text_primary ${styles.message}`}>{prop.message}</span>
        <div className={styles.data}>
          <Link to={`/tasks?dueStatus=Due Today`}>{taskTitles}</Link>
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

export default memo(
  SystemNotification,
  (prev, next) => prev.prop._id === next.prop._id,
);
