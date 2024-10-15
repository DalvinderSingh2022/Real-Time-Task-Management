import React from 'react';

import ViewTasks from '../components/ViewTasks';

import authStyles from "../styles/auth.module.css";
import styles from '../styles/taskdetails.module.css';

const TaskDetails = () => {
    return (
        <div className={`${styles.container}`}>
            <ViewTasks />
            <div className={`${styles.wrapper} ${styles.comments} ${authStyles.container}`}></div>
        </div>
    )
}

export default TaskDetails;