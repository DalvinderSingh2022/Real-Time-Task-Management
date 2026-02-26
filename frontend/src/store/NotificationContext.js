import { createContext, useReducer, useMemo } from "react";

const initialState = {
  notifications: [],
  loaded: false,
};

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_NOTIFICATIONS":
      return {
        notifications: action.payload.notifications,
        loaded: true,
      };

    case "ADD_NOTIFICATION":
      if (
        state.notifications.some(
          (n) => n._id === action.payload.notification._id,
        )
      ) {
        return state;
      }

      return {
        ...state,
        notifications: [action.payload.notification, ...state.notifications],
      };

    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification._id !== action.payload.notificationId,
        ),
      };

    case "READ_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification._id === action.payload.notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      };

    case "RESET_NOTIFICATIONS":
      return initialState;

    default:
      return state;
  }
};

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
  const [notificationsState, dispatch] = useReducer(
    notificationsReducer,
    initialState,
  );

  const loadNotifications = (notifications) => {
    dispatch({
      type: "INITIALIZE_NOTIFICATIONS",
      payload: { notifications },
    });
  };

  const addNotification = (notification) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: { notification },
    });
  };

  const deleteNotification = (notificationId) => {
    dispatch({
      type: "DELETE_NOTIFICATION",
      payload: { notificationId },
    });
  };

  const readNotification = (notificationId) => {
    dispatch({
      type: "READ_NOTIFICATION",
      payload: { notificationId },
    });
  };

  const resetNotifications = () => {
    dispatch({ type: "RESET_NOTIFICATIONS" });
  };

  const unreadCount = useMemo(
    () => notificationsState.notifications.filter((n) => !n.read).length,
    [notificationsState.notifications],
  );

  return (
    <NotificationsContext.Provider
      value={{
        notificationsState,
        unreadCount,
        addNotification,
        deleteNotification,
        loadNotifications,
        readNotification,
        resetNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export { NotificationsProvider, NotificationsContext };
