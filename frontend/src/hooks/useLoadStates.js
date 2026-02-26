import { useContext, useEffect, useRef } from "react";

import { TasksContext } from "../store/TasksContext";
import { UsersContext } from "../store/UsersContext";
import { NotificationsContext } from "../store/NotificationContext";
import { notifications, tasks, users } from "../utils/apiendpoints";

const useLoadStates = () => {
  const tokenRef = useRef(localStorage.getItem("jwt"));

  const { loadTasks } = useContext(TasksContext);
  const { loadUsers } = useContext(UsersContext);
  const { loadNotifications } = useContext(NotificationsContext);

  const hasLoadedUsers = useRef(false);
  const hasLoadedTasks = useRef(false);
  const hasLoadedNotifications = useRef(false);

  useEffect(() => {
    if (!tokenRef.current || hasLoadedUsers.current) return;

    hasLoadedUsers.current = true;

    const fetchUsers = async () => {
      try {
        const data = await users.all();
        loadUsers(data.users);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!tokenRef.current || hasLoadedNotifications.current) return;

    hasLoadedNotifications.current = true;

    const fetchNotifications = async () => {
      try {
        const data = await notifications.all();
        loadNotifications(data.notifications);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!tokenRef.current || hasLoadedTasks.current) return;

    hasLoadedTasks.current = true;

    const fetchTasks = async () => {
      try {
        const data = await tasks.all();
        loadTasks(data.tasks);
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }
    };

    fetchTasks();
  }, [loadTasks]);
};

export default useLoadStates;
