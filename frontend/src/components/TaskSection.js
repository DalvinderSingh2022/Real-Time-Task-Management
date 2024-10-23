import React, { memo, useContext } from 'react';

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
            <header className={`flex ${styles.header}`}><h1>{status}</h1><h1>{tasks?.length || 0}</h1></header>
            <div className={`flex col gap2 tasks_container ${styles.tasks_container}`}>
                {tasks?.length > 0
                    ? tasks.map(task => <Task {...task} key={task._id} />)
                    : tasks ? <div className='text_secondary flex'>There is no task</div> : <div className={`loading ${styles.loading}`}></div>
                }
            </div>
        </section>
    )
}

export default memo(TaskSection, (prev, next) => prev?.tasks?.length === next?.tasks?.length && prev?.status === next?.status);
