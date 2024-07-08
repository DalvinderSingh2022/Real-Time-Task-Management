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
            return { tasks: [...state.tasks, action.payload.task] };
        case 'DELETE_TASK':
            return { tasks: state.tasks.filter((task) => task.id !== action.payload.taskId) };
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

    return (
        <TasksContext.Provider value={{ tasksState, createTask, deleteTask, loadTasks }}>
            {children}
        </TasksContext.Provider>
    );
};

export { TasksProvider, TasksContext };