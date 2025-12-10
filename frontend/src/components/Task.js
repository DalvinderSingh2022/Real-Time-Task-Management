import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/tasks.module.css";

import Response from "./Response";

import { AuthContext } from "../store/AuthContext";
import { DragAndDropContext } from "../store/DragAndDropContext";

const Task = (task) => {
  const { authState } = useContext(AuthContext);
  const [dragging, setDragging] = useState(false);
  const context = useContext(DragAndDropContext);

  return (
    <>
      {context?.response && <Response />}
      <div
        draggable={!!context}
        onDragStart={() => {
          setDragging(true);
          context?.setTask(task);
        }}
        onDragEnd={() => setDragging(false)}
        title={`Assigned To: ${task.assignedTo
          .map((user) =>
            user._id !== authState.user._id ? user.name : "(You)"
          )
          .join(", ")}`}
        className={`${styles.task} flex col ${task.status
          .replaceAll(" ", "")
          .toLowerCase()} ${dragging ? "task over" : ""}`}
      >
        <Link
          className={`text_primary ${styles.task_title}`}
          to={`/tasks/${task._id}`}
        >
          {task.title}
        </Link>
        <div className={`text_secondary ${styles.task_description}`}>
          {task.description.substring(0, 115)}
          {task.description.length > 115 ? "..." : ""}
        </div>
        <div className={`flex ${styles.group}`}>
          {task.assignedTo.slice(-5).map((user) => (
            <img
              title={user.name}
              key={user._id}
              src={user.avatar}
              alt="User Avatar"
              className={`avatar ${styles.avatar}`}
            />
          ))}
          {task.assignedTo.length > 5 && (
            <div className={`avatar flex ${styles.avatar}`}>
              +{5 - task.assignedTo.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Task;
