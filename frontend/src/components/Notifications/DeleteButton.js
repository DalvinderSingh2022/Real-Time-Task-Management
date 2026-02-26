import React, { memo, useContext, useEffect, useMemo } from "react";

import { IoCloseSharp } from "react-icons/io5";

import { NotificationsContext } from "../../store/NotificationContext";
import { AppContext } from "../../store/AppContext";
import { notifications } from "../../utils/apiendpoints";
import Response from "../Response";

const DeleteButton = ({ response, setResponse, prop }) => {
  const { notificationsState, readNotification, deleteNotification } =
    useContext(NotificationsContext);
  const { addToast } = useContext(AppContext);

  const notification = useMemo(
    () =>
      notificationsState.notifications.find(
        (notification) => notification._id === prop._id,
      ),
    [notificationsState, prop._id],
  );

  useEffect(() => {
    const handleNotification = async () => {
      if (notification && !notification.read) {
        try {
          const data = await notifications.update(prop._id, {
            ...notification,
            read: true,
          });
          readNotification(data.notification._id);
        } catch (error) {
          console.log(".....API ERROR.....", error);
        }
      }
    };

    return () => handleNotification();
  }, [notification, readNotification, prop]);

  const handleDelete = async () => {
    setResponse(true);

    try {
      await notifications.delete(prop._id);

      addToast({ type: "success", message: "Notification deleted" });
      deleteNotification(prop._id);
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
  };

  return (
    <>
      {response && <Response />}
      <button
        className="button round flex text_primary"
        title="Delete"
        onClick={handleDelete}
      >
        <IoCloseSharp />
      </button>
    </>
  );
};

export default memo(
  DeleteButton,
  (prev, next) => prev?.prop?._id === next?.prop?._id,
);
