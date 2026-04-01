import { useContext, useEffect } from "react";

import { TasksContext } from "../store/TasksContext";
import { UsersContext } from "../store/UsersContext";
import { NotificationsContext } from "../store/NotificationContext";
import { notifications, tasks, users } from "../utils/apiendpoints";
import { AdminContext } from "../store/AdminContext";
import { AuthContext } from "../store/AuthContext";

const useLoadStates = () => {
  const { authState } = useContext(AuthContext);
  const { loadTasks, tasksState } = useContext(TasksContext);
  const { loadUsers, usersState } = useContext(UsersContext);
  const { loadData, adminState } = useContext(AdminContext);
  const { loadNotifications, notificationsState } =
    useContext(NotificationsContext);

  useEffect(() => {
    if (!authState.token || usersState.loaded) return;

    const fetchUsers = async () => {
      try {
        const data = await users.all();
        loadUsers(data.users);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchUsers();
  }, [loadUsers, usersState.loaded, authState.token]);

  useEffect(() => {
    if (!authState.token || notificationsState.loaded) return;

    const fetchNotifications = async () => {
      try {
        const data = await notifications.all();
        loadNotifications(data.notifications);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchNotifications();
  }, [loadNotifications, notificationsState.loaded, authState.token]);

  useEffect(() => {
    if (!authState.token || tasksState.loaded) return;

    const fetchTasks = async () => {
      try {
        const data = await tasks.all();
        loadTasks(data.tasks);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchTasks();
  }, [loadTasks, tasksState.loaded, authState.token]);

  useEffect(() => {
    if (
      !authState.token ||
      adminState.loaded ||
      authState.user?.role !== "admin"
    )
      return;

    const fetchData = async () => {
      try {
        const data = await users.pending();
        loadData(data.users);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchData();
  }, [loadData, adminState.loaded, authState.user?.role, authState.token]);
};

export default useLoadStates;
