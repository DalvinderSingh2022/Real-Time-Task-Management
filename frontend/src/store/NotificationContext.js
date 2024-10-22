import { createContext, useReducer } from 'react';

const initialState = {
    notifications: [],
    loaded: false
};

const notificationsReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_NOTIFICATIONS':
            return { notifications: [...state.notifications, ...action.payload.notifications], loaded: true }
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [...state.notifications, action.payload.notification] };
        case 'DELETE_NOTIFICATION':
            return { ...state, notifications: state.notifications.filter((notification) => notification._id !== action.payload.notificationId) };
        case 'RESET_NOTIFICATIONS':
            return initialState
        case 'READ_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.map((notification) => {
                    if (notification._id === action.payload.notificationId) {
                        return { ...notification, read: true };
                    }
                    return notification;
                })
            };
        default:
            return state;
    }
};

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
    const [notificationsState, dispatch] = useReducer(notificationsReducer, initialState);

    const loadNotifications = (notifications) => {
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: { notifications } });
    };

    const addNotification = (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { notification } });
    };

    const deleteNotification = (notificationId) => {
        dispatch({ type: 'DELETE_NOTIFICATION', payload: { notificationId } });
    };

    const readNotification = (notificationId) => {
        dispatch({ type: 'READ_NOTIFICATION', payload: { notificationId } });
    };

    const resetNotifications = () => {
        dispatch({ type: 'RESET_NOTIFICATIONS' });
    };

    return (
        <NotificationsContext.Provider value={{ notificationsState, addNotification, deleteNotification, loadNotifications, readNotification, resetNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export { NotificationsProvider, NotificationsContext };