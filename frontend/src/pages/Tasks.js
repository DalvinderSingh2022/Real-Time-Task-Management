import React, { useContext, useEffect, useState } from 'react';

import { FaPlus } from "react-icons/fa";

import styles from "../styles/tasks.module.css";

import { DragAndDropContext } from '../store/DragAndDropContext';
import { TasksContext } from '../store/TasksContext';
import TaskSection from '../components/TaskSection';
import AddTask from '../components/AddTask';
import useSearch from '../hooks/useSearch';

const TaskDueTypes = ['Due Today', 'Due Tomorrow', 'Due Yesterday', 'Due This Week', 'Due Last Week', 'Due This Month', 'Over due'];

const Tasks = () => {
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(null);
    const [progress, setProgress] = useState(null);
    const [completed, setCompleted] = useState(null);
    const [handleChange, tasks, query] = useSearch(tasksState.tasks, 'title', 'dueStatus');

    useEffect(() => {
        if (!tasks) return;
        const groupedTasks = tasks.reduce((acc, task) => {
            const status = task.status.toLowerCase().replaceAll(" ", '');
            acc[status].push(task);

            return acc;
        }, { notstarted: [], inprogress: [], completed: [] });

        setNotStarted(groupedTasks.notstarted);
        setProgress(groupedTasks.inprogress);
        setCompleted(groupedTasks.completed);
    }, [tasks]);

    return (
        <article>
            <SearchInput handleChange={handleChange} query={query} />
            <div className={styles.container}>
                <TaskSection tasks={notStarted} status={'Not Started'} />
                <TaskSection tasks={progress} status={'In Progress'} />
                <TaskSection tasks={completed} status={'Completed'} />
            </div>
        </article>
    )
}

const SearchInput = ({ handleChange, query }) => {
    const { response } = useContext(DragAndDropContext);
    const [addTask, setAddTask] = useState(false);

    return (
        <>
            {addTask && <AddTask remove={() => setAddTask(false)} />}
            <form className={`${styles.filters} wrap flex gap2`} onSubmit={e => e.preventDefault()}>
                <input
                    type="search"
                    name="q"
                    placeholder='search by title'
                    value={query.get('q') || ''}
                    onChange={handleChange}
                />
                <button type='button' className={`button primary flex gap2 ${styles.create_btn}`} onClick={() => setAddTask(true)}>
                    <FaPlus />
                    <span>Create</span>
                </button>
                <select
                    defaultValue={query.get('dueStatus') || ''}
                    onChange={handleChange}
                    name='dueStatus'
                    className='button primary'
                >
                    <option value=''>All</option>
                    {TaskDueTypes.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                {response && <div className="loading" style={{ margin: 0 }}></div>}
            </form>
        </>
    );
}
export default Tasks;