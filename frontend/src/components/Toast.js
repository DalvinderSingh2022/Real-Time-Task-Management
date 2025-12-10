import React, { useContext } from "react";

import { IoMdClose } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { AppContext } from "../store/AppContext";

const icons = {
  success: <BsPatchCheckFill />,
  error: <BsExclamationOctagonFill />,
  warning: <FaExclamationTriangle />,
  info: <FaCircleInfo />,
};

const Toast = () => {
  const { appState, removeToast } = useContext(AppContext);

  return (
    <>
      <div className="notifications flex col gap2">
        {appState.toasts.length
          ? appState.toasts.map((toast) => (
              <div className={`flex gap toast ${toast.type}`} key={toast.id}>
                <span className="flex">{icons[toast.type]}</span>
                <div className="content">
                  <div className="type text_primary">{toast.type}</div>
                  <div className="text_secondary">{toast.message}</div>
                </div>
                <span className="flex" onClick={() => removeToast(toast.id)}>
                  <IoMdClose />
                </span>
              </div>
            ))
          : null}
      </div>
    </>
  );
};

export default Toast;
