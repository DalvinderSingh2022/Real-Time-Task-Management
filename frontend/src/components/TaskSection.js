import React, { useContext } from 'react';

import Task from "./Task";

import styles from "../styles/tasks.module.css";
import { DragAndDropContext } from '../store/DragAndDropContext';

let newStatus;
const TaskSection = ({ tasks, status }) => {
    const { setStatus } = useContext(DragAndDropContext);

    return (
        <section
            onDragEnter={(e) => e.target.classList.contains('tasks_container') && e.target.classList.add("over")}
            onDragLeave={(e) => e.target.classList.contains('tasks_container') && e.target.classList.remove("over")}
            onDragOver={() => newStatus = status}
            onDragEndCapture={() => setStatus(newStatus)}
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
