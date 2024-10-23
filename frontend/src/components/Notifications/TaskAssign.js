import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { MdNoteAdd } from "react-icons/md";

import styles from "../../styles/notifications.module.css";
import DeleteButton from './DeleteButton';

const TaskAssign = (prop) => {
    const [response, setResponse] = useState(false);
    const { title, createdAt, dueDate, _id } = prop.data.task;

    return (
        <>
            <div className={`${styles.icon} button round flex`}><MdNoteAdd /></div>
            <div className="w_full">
                <Link to={`/tasks/${_id}`} className={`text_primary ${styles.message}`}>{prop.message}</Link>
                <div className={styles.data}>
                    <div className='text_primary'>Title: {title}</div>
                    <div className='text_primary'>Due Date: {new Date(dueDate).toDateString()}</div>
                    <div className='text_secondary'>{(new Date(createdAt).toDateString()) + " at " + (new Date(createdAt).toLocaleTimeString())}</div>
                </div>
            </div>
            {response ? <div className='loading'></div> : <DeleteButton response={response} setResponse={setResponse} prop={prop} />}
        </>
    )
}

export default memo(TaskAssign, (prev, next) => prev?.data?.task?._id === next?.data?.task?._id);