import React, { useContext } from 'react';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';
import { TasksContext } from '../store/TasksContext';

const AddTask = ({ remove }) => {
    const { authState } = useContext(AuthContext);
    const { createTask } = useContext(TasksContext);

    const handlesubmit = (e) => {
        e.preventDefault();
        const task = {
            title: e.target.title.value,
            description: e.target.description.value,
            dueDate: e.target.dueDate.value,
            assignedTo: e.target.assignedTo.value,
            assignedBy: authState.user._id
        }

        axios.post("http://localhost:4000/api/tasks", task)
            .then(({ data }) => {
                createTask(data.task);
                remove();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
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
                                defaultValue={authState.user._id}
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
    )
}

export default AddTask;