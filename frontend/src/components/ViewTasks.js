import React, { useContext, useState } from 'react';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';
import { TasksContext } from '../store/TasksContext';

const ViewTask = ({ remove, title, description, dueDate, assignedTo, assignedBy, status, _id }) => {
    const { authState } = useContext(AuthContext);
    const { updateTask, deleteTask } = useContext(TasksContext);
    const [users] = useState([]);
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

        axios.put(`http://localhost:4000/api/tasks/${_id}`, task)
            .then(({ data }) => updateTask(data))
            .catch((error) => {
                console.error(error);
            })
            .finally(() => remove());
    }

    const handelDelete = () => {
        axios.delete(`http://localhost:4000/api/tasks/${_id}`)
            .then(() => deleteTask(_id))
            .catch((error) => {
                console.error(error);
            })
            .finally(() => remove());
    }

    return (
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
                                value={task.dueDate}
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
                                value={`${task.assignedTo.name} ${authState.user._id === task.assignedTo._id ? "(You)" : ""}`}
                            >
                                <option value={task.assignedTo._id}>{task.assignedTo.name}</option>
                                {users && users.map(user => user._id !== authState.user._id && <option key={user._id} value={user._id}>{user.name}</option>)}
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
    )
}

export default ViewTask;