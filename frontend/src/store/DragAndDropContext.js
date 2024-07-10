import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

import { SocketContext } from './SocketContext';

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

    const setTask = (task) => {
        dispatch({ type: 'SET_TASK', payload: { task } });
    };

    const setStatus = (status) => {
        dispatch({ type: 'SET_STATUS', payload: { status } });
    };

    const reset = () => {
        dispatch({ type: "RESET" });
        console.log('reset');
    }

    useEffect(() => {
        if (dragAndDropState.task && dragAndDropState.status) {
            console.log(dragAndDropState.task, dragAndDropState.status)
            axios.put(`http://localhost:4000/api/tasks/${dragAndDropState.task._id}`, { ...dragAndDropState.task, status: dragAndDropState.status })
                .then(({ data }) => {
                    reset();
                    socketState.socket.emit('task_updated', data.updatedTask, data.message);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }, [dragAndDropState, socketState])

    return (
        <DragAndDropContext.Provider value={{ setTask, setStatus }}>
            {children}
        </DragAndDropContext.Provider>
    );
};

export { DragAndDropProvider, DragAndDropContext };