import React, { useContext, useState } from 'react';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';
import { SocketContext } from '../store/SocketContext';
import { AppContext } from '../store/AppContext';
import Response from './Response';

const AddTask = ({ remove, assignedTo }) => {
    const { authState } = useContext(AuthContext);
    const { socketState } = useContext(SocketContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState(false);

    const handlesubmit = (e) => {
        e.preventDefault();
        const task = {
            title: e.target.title.value,
            description: e.target.description.value,
            dueDate: e.target.dueDate.value,
            assignedTo: e.target.assignedTo.value,
            assignedBy: authState.user._id
        }
        setResponse(true);

        axios.post("http://localhost:4000/api/tasks", task)
            .then(({ data }) => {
                socketState.socket.emit('task_created', data.task);
                remove();
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
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
                    <form className={`flex col gap w_full modal_child ${authStyles.form}`} onSubmit={handlesubmit}>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="title" className='text_primary'>Title</label>
                            <input
                                type="text"
                                id='title'
                                name='title'
                                placeholder='title'
                            />
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

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="dueDate" className='text_primary'>DueDate</label>
                                <input
                                    type='date'
                                    id='dueDate'
                                    name='dueDate'
                                    placeholder='dueDate'
                                />
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                                <select
                                    name="assignedTo"
                                    id="assignedTo"
                                    disabled={!!assignedTo}
                                    defaultValue={assignedTo || authState.user._id}
                                >
                                    <option value={authState.user._id}>Self</option>
                                    {authState.user.followers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={`flex gap ${modalStyles.group}`}>
                            <button type='submit' className={`button primary ${authStyles.submit_button}`}>Add</button>
                            <button type='button' className={`button secondary ${authStyles.submit_button}`} onClick={remove}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddTask;