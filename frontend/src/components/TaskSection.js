import React from 'react';

import Task from "./Task";

import styles from "../styles/tasks.module.css";

const TaskSection = ({ tasks, status }) => {
    return (
        <section className={`flex col ${styles.wrapper}`}>
            <header className={`flex ${styles.header}`}><div>{status}</div><div>{tasks?.length || 0}</div></header>
            <div className={`flex col gap ${styles.tasks_container}`}>
                {tasks?.length > 0
                    ? tasks.map(task => <Task {...task} key={task._id} />)
                    : (tasks?.length !== 0 ? <div className={`loading ${styles.loading}`}></div> : <div>There is no task</div>)}
            </div>
        </section>
    )
}

export default TaskSection;
