import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import { AppContext } from './AppContext';
import { AuthContext } from './AuthContext';
import { socket } from '../App';

const initialState = {
    task: null,
    status: ''
};

const dragAndDropReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASK':
            return { status: state.status, task: action.payload.task }
        case 'SET_STATUS':
            return { task: state.task, status: action.payload.status };
        case 'RESET':
            return { task: null, status: '' };
        default:
            return state;
    }
};

const DragAndDropContext = createContext();

const DragAndDropProvider = ({ children }) => {
    const [dragAndDropState, dispatch] = useReducer(dragAndDropReducer, initialState);
    const { addToast } = useContext(AppContext);
    const { authState } = useContext(AuthContext);
    const [response, setResponse] = useState(false);

    const setTask = (task) => {
        dispatch({ type: 'SET_TASK', payload: { task } });
    };

    const setStatus = (status) => {
        dispatch({ type: 'SET_STATUS', payload: { status } });
    };

    const reset = () => {
        dispatch({ type: "RESET" });
    }

    useEffect(() => {
        const oldTask = dragAndDropState.task;

        if (oldTask && dragAndDropState.status) {
            if (dragAndDropState.status === oldTask.status) {
                return reset();
            }

            const changes = {
                'status': {
                    field: 'status',
                    oldValue: oldTask.status,
                    newValue: dragAndDropState.status
                }
            }

            setResponse(true);
            axios.put(`https://task-manager-v4zl.onrender.com/api/tasks/${oldTask._id}`, { ...oldTask, status: dragAndDropState.status })
                .then(({ data }) => {
                    const { updatedTask: task } = data;

                    axios.post('https://task-manager-v4zl.onrender.com/api/notifications/update-task', { changes, task, oldTask })
                        .then(({ data: notificationData }) => {
                            const notification = notificationData.notifications.find(n => n.user === authState.user._id);
                            socket.emit('task_updated', data, authState.user, notification, oldTask);
                        });
                })
                .catch((error) => {
                    addToast({ type: 'error', message: error?.response?.data?.message })
                    console.error(error);
                })
                .finally(() => {
                    reset();
                    setResponse(false);
                });
        }
    }, [dragAndDropState, authState, addToast]);

    return (
        <DragAndDropContext.Provider value={{ setTask, setStatus, response }}>
            {children}
        </DragAndDropContext.Provider>
    );
};

export { DragAndDropProvider, DragAndDropContext };