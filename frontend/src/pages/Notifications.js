import React, { useContext } from "react";

import tasksStyles from "../styles/tasks.module.css";
import styles from "../styles/notifications.module.css";

import { NotificationsContext } from "../store/NotificationContext";
import SystemNotification from "../components/Notifications/SystemNotification";
import TaskNotification from "../components/Notifications/TaskNotification";
import UserNotification from "../components/Notifications/UserNotification";

import useSearch from "../hooks/useSearch";

const TYPE_COMPONENT_MAP = {
  task: TaskNotification,
  user: UserNotification,
  system: SystemNotification,
};

const NotificationTypes = [
  "Task update",
  "Task deleted",
  "Task assignment",
  "User follow",
  "User unfollow",
  "Due date reminder",
];

const Notifications = () => {
  const { notificationsState } = useContext(NotificationsContext);

  const [handleChange, filteredNotifications, query] = useSearch(
    notificationsState.notifications,
    "message",
    "type",
  );

  const notifications = filteredNotifications || [];

  const getComponentByType = (type) => {
    if (!type) return null;

    const normalized = type.toLowerCase();

    if (normalized.includes("task")) return TYPE_COMPONENT_MAP.task;
    if (normalized.includes("user")) return TYPE_COMPONENT_MAP.user;
    if (normalized.includes("due")) return TYPE_COMPONENT_MAP.system;

    return null;
  };

  return (
    <article>
      {notifications.length === 0 ? (
        <div className={`flex col gap2 ${styles.container}`}>
          <div className={`flex col gap ${styles.header}`}>
            <div className="text_primary heading">Notifications</div>
            <div className="text_secondary">
              Stay updated with task changes and important activity.
            </div>
          </div>

          <div className="text_secondary">
            You're all caught up! No new notifications.
          </div>
        </div>
      ) : (
        <>
          <SearchInput handleChange={handleChange} query={query} />
          <div className="flex col gap">
            {notificationsState.loaded ? (
              notifications.map((notification) => {
                const Component = getComponentByType(notification.type);

                return (
                  <div
                    key={notification._id}
                    className={`${styles.notification} ${
                      notification.read ? "" : styles.unread
                    } flex gap`}
                    title={notification.type}
                  >
                    {Component ? <Component {...notification} /> : null}
                  </div>
                );
              })
            ) : (
              <div className="loading"></div>
            )}
          </div>
        </>
      )}
    </article>
  );
};

const SearchInput = ({ handleChange, query }) => {
  return (
    <form
      className={`${tasksStyles.filters} flex gap wrap`}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="search"
        name="q"
        value={query.get("q") || ""}
        placeholder="search by title"
        onChange={handleChange}
      />
      <select
        name="type"
        value={query.get("type") || ""}
        onChange={handleChange}
        className="button primary"
      >
        <option value="">All</option>
        {NotificationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </form>
  );
};

export default Notifications;
