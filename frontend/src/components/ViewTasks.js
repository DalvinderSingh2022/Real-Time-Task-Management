import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import homeStyles from "../styles/home.module.css";
import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";
import styles from '../styles/taskdetails.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { socket } from '../hooks/useSocket';
import { notifications, tasks } from '../utils/apiendpoints';
import Response from '../components/Response';

const ViewTask = (prop) => {
    const { authState } = useContext(AuthContext);
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

    const handleAssignedToToggle = (user) => {
        let newAssignedTo = task.assignedTo;
        const userIndex = newAssignedTo.findIndex(u => u._id === user._id);

        (userIndex > -1) ? newAssignedTo.splice(userIndex, 1) : newAssignedTo.push(user);

        setTask(prev => ({ ...prev, assignedTo: newAssignedTo }));
    };

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handlesubmit = async (e) => {
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
            try {
                const { data } = await tasks.update(id, task);
                setTask(data.task);
                setOriginalTask(data.task);

                const { data: notificationData } = await notifications.updateTask({ changes, task: data.task, oldTask: originalTask });
                const notification = notificationData.notifications.find(n => n.user === authState.user._id);
                socket.emit('task_updated', data.task, authState.user, notification, originalTask);

            } catch (error) {
                addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                console.log(".....API ERROR.....", error);
            } finally {
                setResponse('');
            }
        } else {
            addToast({ type: 'error', message: "No changes made to save" });
        }
    }

    const handelDelete = async () => {
        setResponse('delete');
        try {
            await tasks.delete(id);
            const { data: notificationData } = await notifications.deleteTask(task);

            const notification = notificationData.notifications.find(n => n.user === authState.user._id);
            socket.emit('task_deleted', { _id: id, ...task }, task.assignedTo, task.assignedBy, notification);
            navigate('/tasks');

        } catch (error) {
            addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
            console.log(".....API ERROR.....", error);
        } finally {
            setResponse('');
        }
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

                        <div className={`flex gap w_full ${authStyles.group}`}>
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
                            <div className={`flex col ${authStyles.group}`}>
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
                                        className='w_full'
                                    />
                                </div>
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
                                    className='w_full'
                                />
                            </div>
                        </div>

                        <div className={`flex gap w_full ${authStyles.group}`}>
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="status" className='text_primary'>Status</label>
                                <div className={`flex wrap ${modalStyles.check_container}`}>
                                    {["Not Started", "In Progress", "Completed"].map((status) => (
                                        <label key={status} htmlFor={status} className={modalStyles.checkbox + " " + status.replaceAll(" ", "").toLowerCase()}>
                                            <input
                                                type="checkbox"
                                                id={status}
                                                checked={task.status === status}
                                                onChange={() => setTask(prev => ({ ...prev, status }))}
                                            />
                                            <div className={`flex ${modalStyles.check_label}`}>{status}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedBy" className='text_primary'>Assign By</label>
                                <div className={`flex ${modalStyles.check_container}`}>
                                    <div className={`flex ${modalStyles.check_label}`}>
                                        <div>{task.assignedBy.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex col w_full ${authStyles.group}`}>
                            <label htmlFor="assignedTo" className='text_primary'>Assign To</label>
                            <div className={`flex wrap ${modalStyles.check_container}`}>
                                {task.assignedTo.map((user) => (
                                    <div key={user._id} className={`flex ${modalStyles.check_label}`}>
                                        <div>{user.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {task.assignedBy._id === authState.user._id &&
                            <div className={`flex col w_full ${authStyles.group}`}>
                                <label htmlFor="assignedTo" className='text_primary'>Assign task to more users</label>
                                <div className={`flex wrap ${modalStyles.check_container}`}>
                                    {[authState.user, ...authState.user.followers].map((user) => (
                                        <label key={user._id} htmlFor={user._id} className={modalStyles.checkbox}>
                                            <input
                                                type="checkbox"
                                                id={user._id}
                                                checked={task.assignedTo.some(u => user._id === u._id)}
                                                onChange={() => handleAssignedToToggle(user)}
                                            />
                                            <div className={`flex ${modalStyles.check_label}`}>
                                                <div>{user.name}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>}

                        <div className={`flex gap w_full`}>
                            {authState.user._id === task.assignedBy._id &&
                                <button type='button' className={`button flex gap2 ${authStyles.submit_button} ${modalStyles.delete_button}`} onClick={handelDelete}>Delete{response === 'delete' && <div className='loading' style={{ borderBottomColor: 'var(--red)' }}></div>}</button>
                            }
                            {(authState.user._id === task.assignedBy._id || task.assignedTo.some(user => user._id === authState.user._id)) &&
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