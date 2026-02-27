import { useContext, useEffect, useRef } from "react";

import { TasksContext } from "../store/TasksContext";
import { UsersContext } from "../store/UsersContext";
import { NotificationsContext } from "../store/NotificationContext";
import { notifications, tasks, users } from "../utils/apiendpoints";

const useLoadStates = () => {
  const tokenRef = useRef(localStorage.getItem("jwt"));

  const { loadTasks, tasksState } = useContext(TasksContext);
  const { loadUsers, usersState } = useContext(UsersContext);
  const { loadNotifications, notificationsState } = useContext(NotificationsContext);

  useEffect(() => {
    if (!tokenRef.current || usersState.loaded) return;

    const fetchUsers = async () => {
      try {
        const data = await users.all();
        loadUsers(data.users);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchUsers();
  }, [loadUsers, usersState.loaded]);

  useEffect(() => {
    if (!tokenRef.current || notificationsState.loaded) return;

    const fetchNotifications = async () => {
      try {
        const data = await notifications.all();
        loadNotifications(data.notifications);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchNotifications();
  }, [loadNotifications, notificationsState.loaded]);

  useEffect(() => {
    if (!tokenRef.current || tasksState.loaded) return;

    const fetchTasks = async () => {
      try {
        const data = await tasks.all();
        loadTasks(data.tasks);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchTasks();
  }, [loadTasks, tasksState.loaded]);
};

export default useLoadStates;
