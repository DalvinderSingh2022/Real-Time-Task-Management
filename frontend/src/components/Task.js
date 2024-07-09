import React, { useContext, useState } from 'react';

// import { LuCalendarClock } from "react-icons/lu";

import styles from "../styles/tasks.module.css";

import { AuthContext } from '../store/AuthContext';
import ViewTask from './ViewTasks';

const Task = (task) => {
    const [view, setView] = useState(false);
    const { authState } = useContext(AuthContext);

    return (
        <>
            {view && <ViewTask {...task} remove={() => setView(false)} />}
            <div className={`${styles.task} flex col`} onClick={() => setView(true)}>
                <div className={`text_primary ${styles.task_title}`}>{task.title}</div>
                <div className={`text_secondary ${styles.task_description}`}>{task.description}</div>
                <div className={styles.task_assignTo} title={`Assigned To: ${task.assignedTo.name}`}>
                    <span>{task.assignedTo.name}{authState.user._id === task.assignedTo._id ? "(You)" : ""}</span>
                </div>
                <span>{new Date(task.dueDate).toDateString()}</span>
            </div>
        </>
    )
}

export default Task;