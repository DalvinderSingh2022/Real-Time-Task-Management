import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";

import styles from "./../styles/users.module.css";
import adminStyles from "./../styles/admin.module.css";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { users } from "../utils/apiendpoints";
import { AdminContext } from "../store/AdminContext";

const getDaysPending = (dateString) => {
  if (!dateString) return "Unknown";

  const created = new Date(dateString);
  const now = new Date();

  const createdDate = new Date(
    created.getFullYear(),
    created.getMonth(),
    created.getDate(),
  );
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = Math.abs(nowDate - createdDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Since yesterday";

  return `Since ${diffDays} days ago`;
};

const formatDateWithSuffix = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (date === "Invalid Date") return "-";

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix = (day) => {
    if (day > 3 && day < 21) return "th";

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
};

const Admin = () => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);
  const { adminState } = useContext(AdminContext);

  const handleApprove = async (userId, action) => {
    try {
      const reason = action === "reject" ? prompt("Reason for rejection:") : "";

      await users.approve(userId, { action, reason });

      addToast({
        type: "success",
        message: `User ${action}d successfully`,
      });

      // await fetchPendingUsers();
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });
    }
  };

  if (!authState.authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authState.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`flex col gap2 ${styles.container}`}>
      {adminState.members.length === 0 ? (
        <>
          <div className={`flex col gap ${styles.header}`}>
            <div className="text_primary heading">Pending Approvals</div>
            <div className="text_secondary">
              Review and approve new user registrations for your organization.
            </div>
          </div>
          <div className="text_secondary">No pending approvals</div>
        </>
      ) : (
        <div className={adminStyles.table_container}>
          <div
            className={`${adminStyles.row} ${adminStyles.header} flex items-stretch`}
          >
            <div>Name</div>
            <div>Email</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Tasks</div>
          </div>

          <div className={`${adminStyles.table_body} w_full`}>
            {adminState.members.map((user) => (
              <div key={user._id} className={adminStyles.row}>
                <Link
                  to={`/users?q=${user.name}`}
                  className="text_primary font-medium"
                >
                  {user.name}
                </Link>

                <div className="text_secondary truncate">{user.email}</div>

                <div className="flex items-start justify-start">
                  <span
                    className={
                      user.isApproved
                        ? adminStyles.badge_success
                        : adminStyles.badge_warning
                    }
                  >
                    {user.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                <div className="text_secondary">
                  {user.isApproved ? (
                    <span>{formatDateWithSuffix(user.createdAt)}</span>
                  ) : (
                    <span className={adminStyles.text_warning}>
                      {getDaysPending(user.createdAt)}
                    </span>
                  )}
                </div>

                <div className="flex gap justify-start">
                  {user.isApproved ? (
                    <>
                      <span className={adminStyles.badge_neutral}>
                        🟡 {user.taskStats?.["Not Started"] || 0}
                      </span>
                      <span className={adminStyles.badge_info}>
                        🔵 {user.taskStats?.["In Progress"] || 0}
                      </span>
                      <span className={adminStyles.badge_success}>
                        🟢 {user.taskStats?.["Completed"] || 0}
                      </span>
                    </>
                  ) : (
                    <>
                      <button
                        className={`button primary flex gap2`}
                        onClick={() => handleApprove(user._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className={`button secondary flex gap2`}
                        onClick={() => handleApprove(user._id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
