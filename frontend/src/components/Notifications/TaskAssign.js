import React from 'react';
import { Link } from 'react-router-dom';

import { IoCloseSharp } from "react-icons/io5";
import { MdNoteAdd } from "react-icons/md";

import styles from "../../styles/notifications.module.css";

const TaskAssign = ({ data }) => {
    const { title, description, dueDate } = data.task;

    return (
        <>
            <div className={`${styles.icon} button round flex`}><MdNoteAdd /></div>
            <div className="w_full">
                <Link to={`/tasks/${'smsm'}`} className={`text_primary ${styles.message}`}>You have been assigned a new task: title by assignedBy</Link>
                <div className={styles.data}>
                    <div className='text_secondary'>Title: {title}</div>
                    <div className='text_secondary'>Description: {description}</div>
                    <div className='text_secondary'>Duedate: {new Date(dueDate).toDateString()}</div>
                </div>
            </div>
            <button className='button round flex text_primary' title='Delete'><IoCloseSharp /></button>
        </>
    )
}

export default TaskAssign;