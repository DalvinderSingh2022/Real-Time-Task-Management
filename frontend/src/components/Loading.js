import React from "react";

const Loading = ({ message = "Please wait..." }) => {
  return (
    <div
      className="full_container flex col loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text_primary">{message}</div>
      <span aria-hidden="true"></span>
    </div>
  );
};

export default Loading;
