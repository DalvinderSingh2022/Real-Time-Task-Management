import {
  createContext,
  useCallback,
  useReducer,
  useRef,
  useEffect,
} from "react";

import { AuthProvider } from "./AuthContext";
import { TasksProvider } from "./TasksContext";
import { UsersProvider } from "./UsersContext";
import { NotificationsProvider } from "./NotificationContext";

const initialState = {
  toasts: [],
};

const MAX_TOASTS = 5;

const AppReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      const updatedToasts = [...state.toasts, action.payload.toast];

      return {
        ...state,
        toasts:
          updatedToasts.length > MAX_TOASTS
            ? updatedToasts.slice(-MAX_TOASTS)
            : updatedToasts,
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
      };

    default:
      return state;
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appState, dispatch] = useReducer(AppReducer, initialState);
  const timeouts = useRef({});

  const removeToast = useCallback((id) => {
    dispatch({ type: "REMOVE_TOAST", payload: { id } });

    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
  }, []);

  const addToast = useCallback(
    (toast) => {
      const id = `${Date.now()}-${Math.random()}`;

      dispatch({
        type: "ADD_TOAST",
        payload: { toast: { ...toast, id } },
      });

      timeouts.current[id] = setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast],
  );

  useEffect(() => {
    const timeOuts = timeouts.current;

    return () => Object.values(timeOuts).forEach(clearTimeout);
  }, []);

  return (
    <AuthProvider>
      <UsersProvider>
        <TasksProvider>
          <NotificationsProvider>
            <AppContext.Provider value={{ appState, addToast, removeToast }}>
              {children}
            </AppContext.Provider>
          </NotificationsProvider>
        </TasksProvider>
      </UsersProvider>
    </AuthProvider>
  );
};

export { AppProvider, AppContext };
