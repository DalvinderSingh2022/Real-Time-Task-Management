import React, { useContext, useState } from 'react';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';
import { SocketContext } from '../store/SocketContext';
import { AppContext } from '../store/AppContext';
import Response from './Response';

const ViewTask = ({ remove, title, description, dueDate, assignedTo, assignedBy, status, _id }) => {
    const { authState } = useContext(AuthContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState(false);
    const [task, setTask] = useState({
        title,
        description,
        dueDate,
        assignedTo,
        assignedBy,
        status
    });

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        setResponse(true);
        axios.put(`http://localhost:4000/api/tasks/${_id}`, task)
            .then(({ data }) => {
                socketState.socket.emit('task_updated', data.updatedTask, data.message);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => {
                remove();
                setResponse(false);
            });
    }

    const handelDelete = () => {
        setResponse(true);
        axios.delete(`http://localhost:4000/api/tasks/${_id}`)
            .then(({ data }) => {
                socketState.socket.emit('task_deleted', _id, assignedTo, assignedBy, data.message);
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            })
            .finally(() => {
                remove();
                setResponse(false);
            });
    }

    return (
        <>
            {response && <Response />}
            <div className="modal full_container" onClick={remove}>
                <div className={` flex col ${authStyles.container} ${modalStyles.container}`} onClick={e => e.stopPropagation()}>
                    <div>
                        <div className={`w_full text_primary ${authStyles.heading}`}>View Task</div>
                    </div>
                    <form className={`flex col gap w_full modal_child ${authStyles.form}`} onSubmit={handlesubmit}>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="title" className='text_primary'>Title</label>
                            <input
                                disabled={authState.user._id !== task.assignedBy._id}
                                type="text"
                                id='title'
                                name='title'
                                placeholder='title'
                                value={task.title}
                                onChange={e => handlechange(e)}
                            />
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
                                    onChange={(e) => handlechange(e)}>
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
                                />
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                                <select
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    name="assignedTo"
                                    id="assignedTo"
                                    defaultValue={task.assignedTo._id}
                                >
                                    <option value={authState.user._id}>Self</option>
                                    {authState.user.followers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={`flex gap ${modalStyles.group}`}>
                            {authState.user._id === task.assignedBy._id &&
                                <button type='button' className={`button ${authStyles.submit_button} ${modalStyles.delete_button}`} onClick={handelDelete}>Delete</button>
                            }
                            <button type='submit' className={`button primary ${authStyles.submit_button}`}>Save</button>
                            <button type='button' className={`button secondary ${authStyles.submit_button}`} onClick={remove}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ViewTask;