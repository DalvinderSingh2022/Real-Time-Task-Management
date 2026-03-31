import React, { useContext, useRef } from "react";

import Task from "./Task";
import styles from "../styles/tasks.module.css";
import { DragAndDropContext } from "../store/DragAndDropContext";

const TaskSection = ({ tasks, status }) => {
  const { setStatus } = useContext(DragAndDropContext);

  const sectionRef = useRef(null);
  const dragStatusRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    dragStatusRef.current = status;

    if (sectionRef.current) {
      sectionRef.current.classList.add("over");
    }
  };

  const handleDragLeave = () => {
    if (sectionRef.current) {
      sectionRef.current.classList.remove("over");
    }
  };

  const handleDragEndCapture = () => {
    if (sectionRef.current) {
      sectionRef.current.classList.remove("over");
    }

    if (dragStatusRef.current) {
      setStatus(dragStatusRef.current);
    }
  };

  return (
    <section
      ref={sectionRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEndCapture={handleDragEndCapture}
      data-status={status}
      className={`flex col ${styles.wrapper} ${status
        .replaceAll(" ", "")
        .toLowerCase()}`}
    >
      <header className={`flex ${styles.header}`}>
        <h3>{status}</h3>
        <h3>{tasks?.length || 0}</h3>
      </header>
      <div
        className={`flex wrap gap2 tasks_container items-stretch ${styles.tasks_container}`}
      >
        {tasks?.length > 0 ? (
          tasks.map((task) => <Task {...task} key={task._id} />)
        ) : tasks ? (
          <div className="text_secondary flex">There is no task</div>
        ) : (
          <div className={`loading ${styles.loading}`}></div>
        )}
      </div>
    </section>
  );
};

export default TaskSection;
