import React, { memo, useState } from 'react';

import { CgFileRemove } from "react-icons/cg";

import styles from "../../styles/notifications.module.css";
import DeleteButton from './DeleteButton';

const TaskDelete = (prop) => {
    const [response, setResponse] = useState(false);
    const { title, createdAt, description } = prop.data.task;

    return (
        <>
            <div className={`${styles.icon} button round flex`}><CgFileRemove /></div>
            <div className="w_full">
                <span className={`text_primary ${styles.message}`}>{prop.message}</span>
                <div className={styles.data}>
                    <div className='text_primary'>Title: {title}</div>
                    <div className='text_primary'>Description: {description}</div>
                    <div className='text_secondary'>{(new Date(createdAt).toDateString()) + " at " + (new Date(createdAt).toLocaleTimeString())}</div>
                </div>
            </div>
            {response ? <div className='loading'></div> : <DeleteButton response={response} setResponse={setResponse} prop={prop} />}
        </>
    )
}

export default memo(TaskDelete, (prev, next) => prev?.data?.task?._id === next?.data?.task?._id);