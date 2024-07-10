import { createContext, useReducer } from 'react';

const initialState = {
    tasks: [],
    loaded: false
};

const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_TASKS':
            return { tasks: action.payload.tasks, loaded: true }
        case 'CREATE_TASK':
            return { ...state, tasks: [...state.tasks, action.payload.task] };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter((task) => task._id !== action.payload.taskId) };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if (task._id === action.payload.task._id) {
                        return { ...action.payload.task };
                    }
                    return task;
                })
            };
        default:
            return state;
    }
};

const TasksContext = createContext();

const TasksProvider = ({ children }) => {
    const [tasksState, dispatch] = useReducer(tasksReducer, initialState);

    const loadTasks = (tasks) => {
        dispatch({ type: 'LOAD_TASKS', payload: { tasks } });
    };

    const createTask = (task) => {
        dispatch({ type: 'CREATE_TASK', payload: { task } });
    };

    const deleteTask = (taskId) => {
        dispatch({ type: 'DELETE_TASK', payload: { taskId } });
    };

    const updateTask = (task) => {
        dispatch({ type: 'UPDATE_TASK', payload: { task } });
    };

    return (
        <TasksContext.Provider value={{ tasksState, createTask, deleteTask, loadTasks, updateTask }}>
            {children}
        </TasksContext.Provider>
    );
};

export { TasksProvider, TasksContext };