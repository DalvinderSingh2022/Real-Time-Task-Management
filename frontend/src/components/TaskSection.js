import React, { useContext } from 'react';

import Task from "./Task";

import styles from "../styles/tasks.module.css";
import { DragAndDropContext } from '../store/DragAndDropContext';

let newStatus;
let closestSection;
const TaskSection = ({ tasks, status }) => {
    const { setStatus } = useContext(DragAndDropContext);

    return (
        <section
            onDragLeave={() => {
                if (closestSection) closestSection.classList.remove("over");
            }}
            onDragOver={(e) => {
                e.preventDefault();
                newStatus = status; const newClosest = e.target.closest('section');
                if (newClosest) {
                    closestSection = newClosest;
                    closestSection.classList.add("over");
                }
            }}
            onDragEndCapture={() => {
                if (closestSection) {
                    closestSection.classList.remove("over");
                }
                setStatus(newStatus);
            }}
            data-status={status}
            className={`flex col ${styles.wrapper} ${status.replaceAll(" ", '').toLowerCase()}`}
        >
            <header className={`flex ${styles.header}`}><div>{status}</div><div>{tasks?.length || 0}</div></header>
            <div className={`flex col gap tasks_container ${styles.tasks_container}`}>
                {tasks?.length > 0
                    ? tasks.map(task => <Task {...task} key={task._id} />)
                    : (tasks?.length !== 0 ? <div className={`loading ${styles.loading}`}></div> : <div>There is no task</div>)}
            </div>
        </section>
    )
}

export default TaskSection;
