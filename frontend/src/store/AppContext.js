import { createContext, useCallback, useReducer } from 'react';

import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';
import { TasksProvider } from './TasksContext';
import { UsersProvider } from './UsersContext';

const initialState = {
    toasts: [],
}

const AppReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST":
            return { ...state, toasts: [...state.toasts, action.payload.toast] }
        case "REMOVE_TOAST":
            return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload.id) }
        default:
            return state;
    }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [appState, dispatch] = useReducer(AppReducer, initialState);

    const removeToast = useCallback((id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: { id } })
    }, [])

    const addToast = useCallback((toast) => {
        const id = new Date().getTime();

        dispatch({ type: 'ADD_TOAST', payload: { toast: { ...toast, id } } });
        setTimeout(() => removeToast(id), 3000);
    }, [removeToast])

    return (
        <AuthProvider>
            <UsersProvider>
                <TasksProvider>
                    <SocketProvider>
                        <AppContext.Provider value={{ appState, addToast, removeToast }}>
                            {children}
                        </AppContext.Provider>
                    </SocketProvider>
                </TasksProvider>
            </UsersProvider>
        </AuthProvider>
    );
};

export { AppProvider, AppContext };