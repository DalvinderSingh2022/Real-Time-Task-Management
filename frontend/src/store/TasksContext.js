import { createContext, useReducer } from "react";

const initialState = {
  tasks: [],
  loaded: false,
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_TASKS":
      return {
        tasks: action.payload.tasks,
        loaded: true,
      };

    case "CREATE_TASK":
      if (state.tasks.some((t) => t._id === action.payload.task._id)) {
        return state;
      }

      return {
        ...state,
        tasks: [...state.tasks, action.payload.task],
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload.taskId),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload.task._id ? action.payload.task : task,
        ),
      };

    case "RESET_TASKS":
      return initialState;

    default:
      return state;
  }
};

const TasksContext = createContext();

const TasksProvider = ({ children }) => {
  const [tasksState, dispatch] = useReducer(tasksReducer, initialState);

  const loadTasks = (tasks) => {
    dispatch({
      type: "INITIALIZE_TASKS",
      payload: { tasks },
    });
  };

  const createTask = (task) => {
    dispatch({ type: "CREATE_TASK", payload: { task } });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: "DELETE_TASK", payload: { taskId } });
  };

  const updateTask = (task) => {
    dispatch({ type: "UPDATE_TASK", payload: { task } });
  };

  const resetTasks = () => {
    dispatch({ type: "RESET_TASKS" });
  };

  return (
    <TasksContext.Provider
      value={{
        tasksState,
        createTask,
        deleteTask,
        loadTasks,
        updateTask,
        resetTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export { TasksProvider, TasksContext };
