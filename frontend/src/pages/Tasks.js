import React, { useContext, useEffect, useState } from 'react';

import { FaPlus } from "react-icons/fa";

import styles from "../styles/tasks.module.css";

import { DragAndDropContext } from '../store/DragAndDropContext';
import { TasksContext } from '../store/TasksContext';
import TaskSection from '../components/TaskSection';
import AddTask from '../components/AddTask';
import useSearch from '../hooks/useSearch';

const Tasks = () => {
    const { response } = useContext(DragAndDropContext);
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(null);
    const [progress, setProgress] = useState(null);
    const [completed, setCompleted] = useState(null);
    const [addTask, setAddTask] = useState(false);
    const [handleChange, tasks] = useSearch(tasksState.tasks, 'title');

    useEffect(() => {
        if (!tasks) return;

        setNotStarted(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'notstarted'));
        setProgress(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'inprogress'));
        setCompleted(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'completed'));
    }, [tasks]);

    return (
        <article>
            {addTask && <AddTask remove={() => setAddTask(false)} />}
            <SearchInput handleChange={handleChange} setAddTask={setAddTask} response={response} />
            <div className={styles.container}>
                <TaskSection tasks={notStarted} status={'Not Started'} />
                <TaskSection tasks={progress} status={'In Progress'} />
                <TaskSection tasks={completed} status={'Completed'} />
            </div>
        </article>
    )
}

const SearchInput = ({ handleChange, setAddTask, response }) => {
    return (
        <form className={`${styles.filters} flex gap2`} onSubmit={e => e.preventDefault()}>
            <input
                type="search"
                name="q"
                placeholder='search by title'
                onChange={handleChange}
            />
            <button type='button' className={`button primary flex gap2 ${styles.create_btn}`} onClick={() => setAddTask(true)}>
                <FaPlus />
                <span>Create</span>
            </button>
            {response && <div className="loading" style={{ margin: 0 }}></div>}
        </form>);
}
export default Tasks;