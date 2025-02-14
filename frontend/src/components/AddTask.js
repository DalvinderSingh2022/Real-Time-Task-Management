import React, { memo, useContext, useState } from 'react';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { socket } from '../hooks/useSocket';
import { notifications, tasks } from '../utils/apiendpoints';
import Response from './Response';
import User from './User';

const AddTask = ({ remove, initialAssignedTo }) => {
    const { authState } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState(false);
    const [assignedTo, setAssignedTo] = useState(initialAssignedTo.length ? initialAssignedTo : []);

    const handleAssignedToToggle = (userId) => {
        setAssignedTo((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        const task = {
            title: e.target.title.value,
            description: e.target.description.value,
            dueDate: e.target.dueDate.value,
            assignedBy: authState.user._id,
            assignedTo,
        }

        setResponse(true);
        axios.post(tasks.create_task, task)
            .then(({ data: taskData }) => {
                const { task } = taskData;

                axios.post(notifications.assign_task, { task })
                    .then(({ data: notificationData }) => {
                        const [notification] = notificationData.notifications;
                        socket.emit('task_created', task, notification);
                        remove();
                    });
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message });
                console.log(".....API ERROR.....", error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            <div className="modal full_container" onClick={remove}>
                <div className={` flex col ${authStyles.container} ${modalStyles.container}`} onClick={e => e.stopPropagation()}>
                    <div>
                        <div className={`w_full text_primary ${authStyles.heading}`}>New Task</div>
                    </div>
                    <form className={`flex col gap w_full modal_child`} onSubmit={handlesubmit}>
                        <div className={`flex gap2 w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="title" className='text_primary'>Title</label>
                                <input
                                    type="text"
                                    id='title'
                                    name='title'
                                    placeholder='title'
                                />
                            </div>
                            <div className={`flex col ${authStyles.group}`}>
                                <label htmlFor="dueDate" className='text_primary'>DueDate</label>
                                <div className="flex">
                                    <input
                                        type='date'
                                        id='dueDate'
                                        name='dueDate'
                                        placeholder='dueDate'
                                        className='w_full'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="description" className='text_primary'>Description</label>
                            <textarea
                                rows='5'
                                cols='5'
                                id='description'
                                name='description'
                                placeholder='description'
                            />
                        </div>

                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                            <div className={`flex wrap ${modalStyles.check_container}`}>
                                {[...authState.user.followers, authState.user].map((user) => (
                                    <label key={user._id} htmlFor={user._id} className={modalStyles.checkbox}>
                                        <input
                                            type="checkbox"
                                            id={user._id}
                                            checked={assignedTo.includes(user._id)}
                                            onChange={() => handleAssignedToToggle(user._id)}
                                        />
                                        <div className={`flex ${modalStyles.check_label}`}>
                                            <User {...user} removeButton={true} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={`flex gap ${modalStyles.group}`}>
                            <button type='submit' className={`button primary flex gap2 ${authStyles.submit_button}`}>Add{response && <div className='loading'></div>}</button>
                            <button type='button' className={`button secondary ${authStyles.submit_button}`} onClick={remove}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default memo(AddTask, (prev, next) => JSON.stringify(prev?.assignedTo) === JSON.stringify(next?.assignedTo));