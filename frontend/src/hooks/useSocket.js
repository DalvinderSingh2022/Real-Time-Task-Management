import { useContext, useEffect } from "react";

import { TasksContext } from "../store/TasksContext";
import { UsersContext } from "../store/UsersContext";
import { NotificationsContext } from "../store/NotificationContext";
import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";

import io from "socket.io-client";
export const socket = io.connect(process.env.REACT_APP_API_BASE_URL);

const useSocket = () => {
  const { authState, login } = useContext(AuthContext);
  const { tasksState, createTask, updateTask, deleteTask } =
    useContext(TasksContext);
  const { addUser, updateUser, deleteUser } = useContext(UsersContext);
  const { addNotification } = useContext(NotificationsContext);
  const { addToast } = useContext(AppContext);

  useEffect(() => {
    if (!authState.authenticated) return;

    socket.emit("join_room", authState.user._id);

    return () => socket.emit("leave_room", authState.user._id);
  }, [authState]);

  useEffect(() => {
    if (!tasksState.loaded) return;

    tasksState.tasks.map((task) => socket.emit("join_room", task._id));

    return () =>
      tasksState.tasks.map((task) => socket.emit("leave_room", task._id));
  }, [tasksState]);

  useEffect(() => {
    socket.on("new_notification", (notification) =>
      addNotification(notification)
    );

    return () => socket.off("new_notification");
  }, [addNotification]);

  useEffect(() => {
    socket.on("task_deleted", (task, assignedTo, assignedBy) => {
      if (authState.user._id === assignedBy._id) {
        addToast({ type: "warning", message: `Task : ${task.title} Deleted` });
      } else {
        assignedTo.forEach((user) => {
          if (authState.user._id === user._id)
            addToast({
              type: "warning",
              message: `Task : ${task.title} Deleted by ${assignedBy.name} `,
            });
        });
      }
      deleteTask(task._id);
    });

    return () => socket.off("task_deleted");
  }, [authState, deleteTask, addToast]);

  useEffect(() => {
    socket.on("task_created", (task) => {
      if (authState.user._id === task.assignedBy._id) {
        addToast({
          type: "success",
          message: `Task created and assigned ${
            task.assignedTo.some((user) => user._id === authState.user._id)
              ? `to ${task.assignedTo.map((user) => user.name).join(", ")}`
              : ""
          }`,
        });
      } else {
        task.assignedTo.forEach((user) => {
          if (authState.user._id === user._id)
            addToast({
              type: "info",
              message: `Task: ${task.title} assigned by ${task.assignedBy.name}`,
            });
        });
      }
      createTask(task);
    });

    return () => socket.off("task_created");
  }, [authState, createTask, addToast]);

  useEffect(() => {
    socket.on("task_updated", (task, user) => {
      if (
        authState.user._id === task.assignedBy._id ||
        task.assignedTo.some((u) => u._id === authState.user._id)
      ) {
        updateTask(task);
        if (user)
          addToast({
            type: "info",
            message: `Task: ${task.title} updated ${
              user._id !== authState.user._id ? `by ${user.name}` : ""
            }`,
          });
      }
    });

    return () => socket.off("task_updated");
  }, [addToast, updateTask, authState]);

  useEffect(() => {
    socket.on("user_followed", (authUser, userToFollow) => {
      updateUser(authUser);
      updateUser(userToFollow);

      if (authState.user._id === authUser._id) {
        login(authUser);
        addToast({
          type: "success",
          message: `Followed ${userToFollow.name} successfully`,
        });
      } else if (authState.user._id === userToFollow._id) {
        login(userToFollow);
        addToast({ type: "info", message: `${authUser.name} followed you` });
      }
    });

    return () => socket.off("user_followed");
  }, [authState, login, updateUser, addToast]);

  useEffect(() => {
    socket.on("user_unfollowed", (authUser, userToUnfollow) => {
      updateUser(authUser);
      updateUser(userToUnfollow);

      if (authState.user._id === authUser._id) {
        login(authUser);
        addToast({
          type: "info",
          message: `Unfollowed ${userToUnfollow.name} successfully`,
        });
      } else if (authState.user._id === userToUnfollow._id) {
        login(userToUnfollow);
        addToast({
          type: "warning",
          message: `${authUser.name} Unfollowed you`,
        });
      }
    });

    return () => socket.off("user_unfollowed");
  }, [authState, login, updateUser, addToast]);

  useEffect(() => {
    socket.on("user_left", (user) => deleteUser(user._id));

    return () => socket.off("user_left");
  }, [deleteUser]);

  useEffect(() => {
    socket.on("user_join", (user) => addUser(user));

    return () => socket.off("user_join");
  }, [addUser]);

  useEffect(() => {
    socket.on("user_update", (user) => updateUser(user));

    return () => socket.off("user_update");
  }, [updateUser]);
};

export default useSocket;
