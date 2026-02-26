import React, { memo, useContext, useMemo } from "react";

import { IoMdClose } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { BsExclamationOctagonFill, BsPatchCheckFill } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { AppContext } from "../store/AppContext";

const iconMap = {
  success: BsPatchCheckFill,
  error: BsExclamationOctagonFill,
  warning: FaExclamationTriangle,
  info: FaCircleInfo,
};

const ToastItem = memo(
  ({ id, type, message, removeToast }) => {
    const Icon = useMemo(() => iconMap[type], [type]);

    return (
      <div className={`flex gap toast ${type}`}>
        <span className="flex">
          <Icon />
        </span>
        <div className="content">
          <div className="type text_primary">{type}</div>
          <div className="text_secondary">{message}</div>
        </div>
        <span className="flex" onClick={() => removeToast(id)}>
          <IoMdClose />
        </span>
      </div>
    );
  },
  (prev, next) => prev.id === next.id,
);

const Toast = () => {
  const { appState, removeToast } = useContext(AppContext);

  return (
    <div className="notifications flex col gap2">
      {appState.toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          removeToast={removeToast}
        />
      ))}
    </div>
  );
};

export default Toast;
