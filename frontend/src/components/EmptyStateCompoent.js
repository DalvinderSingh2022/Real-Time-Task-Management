import React from "react";

const EmptyState = ({
  isLoaded = false,
  title = "No Data",
  description = "",
  message = "No items available at the moment.",
  children,
}) => {
  if (!isLoaded) {
    return <div className="loading" aria-label="Loading content..." />;
  }

  return (
    <div className="flex col gap2">
      {(title || description) && (
        <div className="flex col gap">
          {title && <div className="text_primary heading">{title}</div>}
          {description && <div className="text_secondary">{description}</div>}
        </div>
      )}

      <div className="text_secondary">{message}</div>

      {children && <div className="mt-1">{children}</div>}
    </div>
  );
};

export default EmptyState;
