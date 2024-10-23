import React, { memo, useState } from 'react';

import { RiUserUnfollowFill } from "react-icons/ri";

import styles from "../../styles/notifications.module.css";
import DeleteButton from './DeleteButton';

const UnfollowUser = (prop) => {
    const [response, setResponse] = useState(false);

    return (
        <>
            <div className={`${styles.icon} button round flex`}><RiUserUnfollowFill /></div>
            <div className="w_full">
                <span className={`text_primary ${styles.message}`}>{prop.message}</span>
                <div className={styles.data}>
                    <div className='text_secondary'>{(new Date(prop.createdAt).toDateString()) + " at " + (new Date(prop.createdAt).toLocaleTimeString())}</div>
                </div>
            </div>
            {response ? <div className='loading'></div> : <DeleteButton response={response} setResponse={setResponse} prop={prop} />}
        </>
    )
}

export default memo(UnfollowUser, (prev, next) => prev?.data?.task?._id === next?.data?.task?._id);