import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import { SocketContext } from './SocketContext';
import { AppContext } from './AppContext';
import { AuthContext } from './AuthContext';

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
    const { socketState } = useContext(SocketContext);
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
        if (dragAndDropState.task && dragAndDropState.status) {
            if (dragAndDropState.status === dragAndDropState.task.status) {
                return reset();
            }

            const changes = {
                'status': {
                    field: 'status',
                    oldValue: dragAndDropState.task.status,
                    newValue: dragAndDropState.status
                }
            }

            setResponse(true);
            axios.put(`https://task-manager-v4zl.onrender.com/api/tasks/${dragAndDropState.task._id}`, { ...dragAndDropState.task, status: dragAndDropState.status })
                .then(({ data }) => {
                    axios.post('https://task-manager-v4zl.onrender.com/api/notifications/update-task', { changes, task: data.updatedTask, oldTask: dragAndDropState.task })
                        .then(({ data: notificationData }) => {
                            socketState.socket.emit('task_updated', data.updatedTask, authState.user, notificationData.notification, dragAndDropState.task);
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
    }, [dragAndDropState, socketState, authState, addToast]);

    return (
        <DragAndDropContext.Provider value={{ setTask, setStatus, response }}>
            {children}
        </DragAndDropContext.Provider>
    );
};

export { DragAndDropProvider, DragAndDropContext };