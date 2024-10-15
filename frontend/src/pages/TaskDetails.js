import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from '../styles/taskdetails.module.css';

import { TasksContext } from '../store/TasksContext';
import NotFound from '../pages/NotFound';
import ViewTasks from '../components/ViewTasks';
import TaksComments from '../components/TaksComments';

const TaskDetails = () => {
    const { tasksState } = useContext(TasksContext);
    const [task, setTask] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        setTask(tasksState.tasks.filter(task => task._id === id));
    }, [tasksState, id]);

    return (
        task?.length > 0
            ? <div className={`${styles.container}`}>
                <ViewTasks />
                <TaksComments />
            </div>
            : task ? <NotFound /> : <div className="loading"></div>
    )
}

export default TaskDetails;