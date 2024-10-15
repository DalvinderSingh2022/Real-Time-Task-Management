import React from 'react';

import ViewTasks from '../components/ViewTasks';
import TaksComments from '../components/TaksComments';

import styles from '../styles/taskdetails.module.css';

const TaskDetails = () => {
    return (
        <div className={`${styles.container}`}>
            <ViewTasks />
            <TaksComments />
        </div>
    )
}

export default TaskDetails;