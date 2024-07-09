import React, { useContext, useEffect, useState } from 'react';

import styles from "../styles/tasks.module.css";

import { TasksContext } from '../store/TasksContext';
import TaskSection from '../components/TaskSection';

const Tasks = () => {
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(null);
    const [progress, setProgress] = useState(null);
    const [completed, setCompleted] = useState(null);

    useEffect(() => {
        if (!tasksState.loaded) {
            return;
        }

        setNotStarted(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'notstarted'));
        setProgress(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'inprogress'));
        setCompleted(tasksState.tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'completed'));
    }, [tasksState]);

    return (
        <article>
            <div className={styles.container}>
                <TaskSection tasks={notStarted} status={'Not Started'} />
                <TaskSection tasks={progress} status={'In Progress'} />
                <TaskSection tasks={completed} status={'Completed'} />
            </div>
        </article>
    )
}

export default Tasks;