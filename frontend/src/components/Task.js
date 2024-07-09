import React from 'react';

import { LuCalendarClock } from "react-icons/lu";

import styles from "../styles/tasks.module.css";

const Task = ({ title, description, dueDate, assignedTo }) => {

    return (
        <div className={`${styles.task} flex col`} >
            <div className={`text_primary ${styles.task_title}`}>{title}</div>
            <div className={`text_secondary ${styles.task_description}`}>{description}</div>
            <div className={styles.task_assignTo} title={`Assigned To: ${assignedTo.name}`}>
                <span>{assignedTo.name}</span>
            </div>
            <span className='flex gap2'>
                <LuCalendarClock />{new Date(dueDate).toDateString()}
            </span>
        </div>
    )
}

export default Task;