import React, { memo, useContext, useState } from 'react';

import styles from "../styles/tasks.module.css";

import ViewTask from './ViewTasks';
import Response from './Response';

import { AuthContext } from '../store/AuthContext';
import { DragAndDropContext } from '../store/DragAndDropContext';

const Task = (task) => {
    const [view, setView] = useState(false);
    const { authState } = useContext(AuthContext);
    const [dragging, setDragging] = useState(false);
    const context = useContext(DragAndDropContext);

    return (
        <>
            {view && <ViewTask {...task} remove={() => setView(false)} />}
            {context?.response && <Response />}
            <div
                draggable={!!context}
                onDragStart={() => {
                    setDragging(true);
                    context?.setTask(task);
                }}
                onDragEnd={() => setDragging(false)}
                className={`${styles.task} flex col ${task.status.replaceAll(" ", '').toLowerCase()} ${dragging ? "task over" : ""}`}
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

export default memo(Task);