import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import styles from '../styles/taskdetails.module.css';
import homeStyles from "../styles/home.module.css";

import { AppContext } from '../store/AppContext';
import { tasks } from '../utils/apiendpoints';
import NotFound from '../pages/NotFound';
import ViewTasks from '../components/ViewTasks';
import TaksComments from '../components/TaksComments';

const TaskDetails = () => {
    const { addToast } = useContext(AppContext);
    const [task, setTask] = useState(null);
    const [invalidId, setInvalidId] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            axios.get(tasks.get_task(id))
                .then(({ data }) => setTask(data.task))
                .catch((error) => {
                    setInvalidId(true);
                    addToast({ type: 'error', message: error?.response?.data?.message });
                    console.log(".....API ERROR.....", error);
                });
        })();
    }, [id, addToast]);

    if (invalidId) return <NotFound />;

    return (
        <div className={`${styles.container} ${homeStyles.article}`}>
            <ViewTasks task={task} />
            <TaksComments task={task} />
        </div>
    )
}

export default TaskDetails;