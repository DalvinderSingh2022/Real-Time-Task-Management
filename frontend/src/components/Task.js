import React, { memo, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from "../styles/tasks.module.css";

import Response from './Response';

import { AuthContext } from '../store/AuthContext';
import { DragAndDropContext } from '../store/DragAndDropContext';

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
                title={`${task.title} : ${task.status}`}
                className={`${styles.task} flex col ${task.status.replaceAll(" ", '').toLowerCase()} ${dragging ? "task over" : ""}`}
            >
                <Link className={`text_primary ${styles.task_title}`} to={`/tasks/${task._id}`}>{task.title}</Link>
                <div className={`text_secondary ${styles.task_description}`}>{task.description}</div>
                <div className={`flex ${styles.group}`}>
                    <span title={`Assigned To: ${task.assignedTo.name}`}>{task.assignedTo.name}{authState.user._id === task.assignedTo._id ? "(You)" : ""}</span>
                    <span title={`DueDate : ${new Date(task.dueDate).toDateString()}`}>{new Date(task.dueDate).toDateString().slice(4)}</span>
                </div>
            </div>
        </>
    )
}

export default memo(Task);