import React, { useContext, useEffect, useState } from 'react';

import { FaPlus } from "react-icons/fa";

import styles from "../styles/tasks.module.css";

import { TasksContext } from '../store/TasksContext';
import TaskSection from '../components/TaskSection';
import AddTask from '../components/AddTask';
import { DragAndDropProvider } from '../store/DragAndDropContext';

const Tasks = () => {
    const { tasksState } = useContext(TasksContext);
    const [notStarted, setNotStarted] = useState(null);
    const [progress, setProgress] = useState(null);
    const [completed, setCompleted] = useState(null);
    const [addTask, setAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setNotStarted(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'notstarted'));
        setProgress(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'inprogress'));
        setCompleted(tasks.filter(task => task.status.toLowerCase().replaceAll(" ", '') === 'completed'));
    }, [tasks]);

    useEffect(() => {
        if (!tasksState.loaded) {
            return;
        }

        setTasks(tasksState.tasks.filter(task =>
            task.title.toLowerCase().replaceAll(" ", '').includes(search) ||
            task.description.toLowerCase().replaceAll(" ", '').includes(search)
        ));
    }, [tasksState, search])

    return (
        <article>
            {addTask && <AddTask remove={() => setAddTask(false)} />}
            <form className={`${styles.filters}`}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='search by title, description'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type='button' className="button primary flex gap2" onClick={() => setAddTask(true)}>
                    <FaPlus />
                    <span>Create</span>
                </button>
            </form>
            <div className={styles.container}>
               <DragAndDropProvider>
                    <TaskSection tasks={notStarted} status={'Not Started'} />
                    <TaskSection tasks={progress} status={'In Progress'} />
                    <TaskSection tasks={completed} status={'Completed'} />
               </DragAndDropProvider>
            </div>
        </article>
    )
}

export default Tasks;