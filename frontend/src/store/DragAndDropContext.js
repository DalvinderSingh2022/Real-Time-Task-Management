import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

import { SocketContext } from './SocketContext';
import { AppContext } from './AppContext';

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
            axios.put(`http://localhost:4000/api/tasks/${dragAndDropState.task._id}`, { ...dragAndDropState.task, status: dragAndDropState.status })
                .then(({ data }) => {
                    reset();
                    socketState.socket.emit('task_updated', data.updatedTask, data.message);
                })
                .catch((error) => {
                    addToast({ type: 'error', message: error.response.data.message })
                    console.error(error);
                })
        }
    }, [dragAndDropState, socketState, addToast]);

    return (
        <DragAndDropContext.Provider value={{ setTask, setStatus }}>
            {children}
        </DragAndDropContext.Provider>
    );
};

export { DragAndDropProvider, DragAndDropContext };