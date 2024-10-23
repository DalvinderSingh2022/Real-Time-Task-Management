import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import homeStyles from "../styles/home.module.css";
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
    const [originalTask, setOriginalTask] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (task && originalTask) return;

        setTask(prop.task);
        setOriginalTask(prop.task);
    }, [prop, task, originalTask]);

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handlesubmit = (e) => {
        e.preventDefault();

        const changes = {};
        Object.keys(originalTask).forEach((key) => {
            if (originalTask[key] !== task[key]) {
                changes[key] = {
                    field: key,
                    oldValue: originalTask[key],
                    newValue: task[key]
                };
            }
        });

        if (Object.keys(changes).length) {
            setResponse('save');
            axios.put(`https://task-manager-v4zl.onrender.com/api/tasks/${id}`, task)
                .then(({ data }) => {
                    setTask(data.updatedTask);
                    setOriginalTask(data.updatedTask);

                    axios.post('https://task-manager-v4zl.onrender.com/api/notifications/update-task', { changes, task: data.updatedTask, oldTask: originalTask })
                        .then(({ data: notificationData }) => {
                            socketState.socket.emit('task_updated', data.updatedTask, authState.user, notificationData.notification, originalTask);
                        });
                })
                .catch((error) => {
                    addToast({ type: 'error', message: error?.response?.data?.message });
                    console.error(error);
                })
                .finally(() => setResponse(''));
        }
    }

    const handelDelete = () => {
        setResponse('delete');
        axios.delete(`https://task-manager-v4zl.onrender.com/api/tasks/${id}`)
            .then(() => {
                navigate('/tasks');
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
            <section className={` flex col ${authStyles.container} ${styles.wrapper}`} onClick={e => e.stopPropagation()}>
                {task ?
                    <form className={`flex col gap w_full modal_child`} onSubmit={handlesubmit}>
                        <header className={`flex ${homeStyles.header}`}>
                            <h3 className='text_primary'>{task.title}</h3>
                        </header>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="title" className='text_primary'>Title</label>
                            <div className='flex'>
                                <input
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    type="text"
                                    id='title'
                                    name='title'
                                    placeholder='title'
                                    title={task.title}
                                    value={task.title}
                                    onChange={e => handlechange(e)}
                                    className='w_full'
                                />
                            </div>
                        </div>
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="description" className='text_primary'>Description</label>
                            <div className="flex">
                                <textarea
                                    disabled={authState.user._id !== task.assignedBy._id}
                                    rows='5'
                                    cols='5'
                                    id='description'
                                    name='description'
                                    placeholder='description'
                                    title={task.description}
                                    value={task.description}
                                    onChange={e => handlechange(e)}
                                    required
                                    className='w_full'
                                />
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="dueDate" className='text_primary'>DueDate</label>
                                <div className="flex">
                                    <input
                                        disabled={authState.user._id !== task.assignedBy._id}
                                        type='date'
                                        id='dueDate'
                                        name='dueDate'
                                        placeholder='dueDate'
                                        title={(task.dueDate).substring(0, 10)}
                                        value={(task.dueDate).substring(0, 10)}
                                        onChange={e => handlechange(e)}
                                        required
                                        className='w_full'
                                    />
                                </div>
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="status" className='text_primary'>Status</label>
                                <div className="flex">
                                    <select
                                        disabled={
                                            authState.user._id !== task.assignedBy._id &&
                                            authState.user._id !== task.assignedTo._id
                                        }
                                        name="status"
                                        id="status"
                                        title={task.status}
                                        value={task.status}
                                        onChange={(e) => handlechange(e)}
                                        required
                                        className='w_full'
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedBy" className='text_primary'>Assign By</label>
                                <div className="flex">
                                    <input
                                        disabled={true}
                                        name="assignedBy"
                                        id="assignedBy"
                                        title={`${task.assignedBy.name} ${authState.user._id === task.assignedBy._id ? "(You)" : ""}`}
                                        value={`${task.assignedBy.name} ${authState.user._id === task.assignedBy._id ? "(You)" : ""}`}
                                        onChange={(e) => handlechange(e)}
                                        required
                                        className='w_full'
                                    />
                                </div>
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                                <div className="flex">
                                    <select
                                        disabled={authState.user._id !== task.assignedBy._id}
                                        name="assignedTo"
                                        id="assignedTo"
                                        defaultValue={task.assignedTo._id}
                                        onChange={(e) => handlechange(e)}
                                        required
                                        className='w_full'
                                    >
                                        <option value={authState.user._id}>{authState.user.name + ' (You)'}</option>
                                        {authState.user.followers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label className='text_primary'>Assigned on</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        title={new Date(task.createdAt).toLocaleString()}
                                        value={new Date(task.createdAt).toLocaleString()}
                                        disabled
                                        className='w_full'
                                    />
                                </div>
                            </div>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label className='text_primary'>Last updated</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        title={new Date(task.updatedAt).toLocaleString()}
                                        value={new Date(task.updatedAt).toLocaleString()}
                                        disabled
                                        className='w_full'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`flex gap w_full`}>
                            {authState.user._id === task.assignedBy._id &&
                                <button type='button' className={`button flex gap2 ${authStyles.submit_button} ${modalStyles.delete_button}`} onClick={handelDelete}>Delete{response === 'delete' && <div className='loading' style={{ borderBottomColor: 'var(--red)' }}></div>}</button>
                            }
                            {(authState.user._id === task.assignedBy._id || authState.user._id === task.assignedTo._id) &&
                                <button className={`button primary flex gap2 ${authStyles.submit_button}`}>Save{response === 'save' && <div className='loading'></div>}</button>
                            }
                        </div>

                    </form>
                    : <div className='loading'></div>}
            </section >
        </>
    )
}

export default ViewTask;