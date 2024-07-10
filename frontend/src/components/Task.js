import React, { useContext, useState } from 'react';

import styles from "../styles/tasks.module.css";

import { AuthContext } from '../store/AuthContext';
import ViewTask from './ViewTasks';
import { DragAndDropContext } from '../store/DragAndDropContext';

const Task = (task) => {
    const [view, setView] = useState(false);
    const { authState } = useContext(AuthContext);
    const context = useContext(DragAndDropContext);

    return (
        <>
            {view && <ViewTask {...task} remove={() => setView(false)} />}
            <div
                draggable={!!context?.setTask}
                onDragStart={() => context?.setTask(task)}
                className={`${styles.task} flex col`}
            >
                <div className={`text_primary ${styles.task_title}`}>{task.title}</div>
                <div className={`text_secondary ${styles.task_description}`}>{task.description}</div>
                <div className={styles.task_assignTo} title={`Assigned To: ${task.assignedTo.name}`}>
                    <span>{task.assignedTo.name}{authState.user._id === task.assignedTo._id ? "(You)" : ""}</span>
                </div>
                <div className={`flex ${styles.group}`}>
                    <span>{new Date(task.dueDate).toDateString()}</span>
                    <button onClick={() => setView(true)} className='primary button'>Edit</button>
                </div>
            </div>
        </>
    )
}

export default Task;