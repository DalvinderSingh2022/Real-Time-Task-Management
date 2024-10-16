import React, { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";
import styles from '../styles/taskdetails.module.css';

import { AuthContext } from '../store/AuthContext';
import { SocketContext } from '../store/SocketContext';
import { AppContext } from '../store/AppContext';
import Response from '../components/Response';

const ViewTask = (prop) => {
    const { authState } = useContext(AuthContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState('');
    const [task, setTask] = useState(null);
    const { id } = useParams();

    useEffect(() => setTask(prop.task), [prop]);

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        setResponse('save');
        axios.put(`https://task-manager-v4zl.onrender.com/api/tasks/${id}`, task)
            .then(({ data }) => {
                socketState.socket.emit('task_updated', data.updatedTask, authState.user);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message })
                console.error(error);
            })
            .finally(() => setResponse(''));
    }

    const handelDelete = () => {
        setResponse('delete');
        axios.delete(`https://task-manager-v4zl.onrender.com/api/tasks/${id}`)
            .then(() => {
                socketState.socket.emit('task_deleted', { _id: id, ...task }, task.assignedTo, task.assignedBy);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message })
                console.error(error);
            })
            .finally(() => setResponse(''));
    }

    return (
        <>
            {response && <Response />}
            <div className={` flex col ${authStyles.container} ${styles.wrapper}`} onClick={e => e.stopPropagation()}>
                {task ?
                    <form className={`flex col gap w_full modal_child`} onSubmit={handlesubmit}>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="title" className='text_primary'>Title</label>
                            <div className={`flex gap2`}>
                                <input
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    type="text"
                                    id='title'
                                    name='title'
                                    placeholder='title'
                                    value={task.title}
                                    onChange={e => handlechange(e)}
                                    className='w_full'
                                />
                                {authState.user._id === task.assignedBy._id &&
                                    <button type='button' className={`button flex gap2 ${authStyles.submit_button} ${modalStyles.delete_button}`} onClick={handelDelete}>Delete{response === 'delete' && <div className='loading' style={{ borderBottomColor: 'var(--red)' }}></div>}</button>
                                }
                                {
                                    (authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) &&
                                    <button className={`button primary flex gap2 ${authStyles.submit_button}`}>Save{response === 'save' && <div className='loading'></div>}</button>
                                }
                            </div>
                        </div>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="description" className='text_primary'>Description</label>
                            <textarea
                                disabled={authState.user._id !== task.assignedBy._id}
                                rows='5'
                                cols='5'
                                id='description'
                                name='description'
                                placeholder='description'
                                value={task.description}
                                onChange={e => handlechange(e)}
                                required
                            />
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="dueDate" className='text_primary'>DueDate</label>
                                <input
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    type='date'
                                    id='dueDate'
                                    name='dueDate'
                                    placeholder='dueDate'
                                    value={(task.dueDate).substring(0, 10)}
                                    onChange={e => handlechange(e)}
                                    required
                                />
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="status" className='text_primary'>Status</label>
                                <select
                                    disabled={
                                        authState.user._id !== task.assignedBy._id &&
                                        authState.user._id !== task.assignedTo._id
                                    }
                                    name="status"
                                    id="status"
                                    value={task.status}
                                    onChange={(e) => handlechange(e)}
                                    required
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedBy" className='text_primary'>Assign By</label>
                                <input
                                    disabled={true}
                                    name="assignedBy"
                                    id="assignedBy"
                                    value={`${task.assignedBy.name} ${authState.user._id === task.assignedBy._id ? "(You)" : ""}`}
                                    onChange={(e) => handlechange(e)}
                                    required
                                />
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                                <select
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    name="assignedTo"
                                    id="assignedTo"
                                    defaultValue={task.assignedTo._id}
                                    onChange={(e) => handlechange(e)}
                                    required
                                >
                                    <option value={authState.user._id}>Self</option>
                                    {authState.user.followers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label className='text_primary'>Last updated</label>
                                <div>{new Date(task.updatedAt).toDateString()} at {new Date(task.updatedAt).toLocaleTimeString()}</div>
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label className='text_primary'>Assigned on</label>
                                <div>{new Date(task.createdAt).toDateString()} at {new Date(task.createdAt).toLocaleTimeString()}</div>
                            </div>
                        </div>

                    </form>
                    : <div className='loading'></div>}
            </div>
        </>
    )
}

export default memo(ViewTask);