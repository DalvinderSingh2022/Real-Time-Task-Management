const jwt = require("jsonwebtoken");

const generateLoginToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "15m",
  });
};

const baseEmailTemplate = (
  userId,
  title,
  message,
  actionLabel,
  actionUrl,
  infoBlock = ""
) => {
  const token = generateLoginToken(userId);
  const redirectPath = encodeURIComponent(actionUrl);
  const link = `${process.env.CLIENT_URL}/magic-login/${token}/${userId}?redirect=${redirectPath}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f9f9fc;
          font-family: 'Inter', Arial, sans-serif;
        "
      >
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="background-color: #f9f9fc; padding: 20px 0;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                width="600"
                style="
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #7c3aed;
                      color: #ffffff;
                      text-align: center;
                      padding: 20px 0;
                      font-size: 24px;
                      font-weight: 600;
                    "
                  >
                    Task Manager
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 30px 40px;">
                    <h2 style="color: #333333; margin-top: 0;">${title}</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                      ${message}
                    </p>

                    ${infoBlock}

                    ${
                      actionLabel && actionUrl && link
                        ? `
                          <a
                            href="${link}"
                            style="
                              display: inline-block;
                              background-color: #7c3aed;
                              color: #ffffff;
                              padding: 14px 28px;
                              text-decoration: none;
                              border-radius: 8px;
                              font-weight: 500;
                              font-size: 16px;
                              margin-top: 12px;
                            "
                          >
                            ${actionLabel}
                          </a>`
                        : ""
                    }
                    ${
                      // <p
                      //   style="
                      //     color: #888888;
                      //     font-size: 14px;
                      //     margin-top: 30px;
                      //     border-top: 1px solid #eee;
                      //     padding-top: 20px;
                      //   "
                      // >
                      //   You’re receiving this email from Task Manager.
                      //   <br />Manage your notifications in your
                      //   <a
                      //     href="${process.env.CLIENT_URL}/settings"
                      //     style="color: #7c3aed; text-decoration: none;"
                      //     >Notification Settings</a>.
                      // </p>
                      ""
                    }
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f4f4f8;
                      text-align: center;
                      color: #888888;
                      font-size: 13px;
                      padding: 12px;
                    "
                  >
                    © ${new Date().getFullYear()} Task Manager. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const taskCreatedTemplate = (
  userId,
  userName,
  createdBy,
  taskTitle,
  taskId,
  dueDate
) =>
  baseEmailTemplate(
    userId,
    "🆕 New Task Assigned",
    `Hi <strong>${userName}</strong>,<br><br>A new task <strong>“${taskTitle}”</strong> has been created and assigned to you by <strong>${createdBy}</strong>.`,
    "View Task",
    `/tasks/${taskId}`,
    `<div style="background-color:#f3e8ff;border-left:4px solid #7c3aed;padding:14px 18px;border-radius:8px;margin:20px 0;">
       <strong>Due Date:</strong> ${dueDate}
     </div>`
  );

const taskUpdatedTemplate = (
  userId,
  userName,
  updatedBy,
  taskTitle,
  taskId,
  newStatus,
  dueDate,
  description
) =>
  baseEmailTemplate(
    userId,
    "🔄 Task Updated",
    `Hi <strong>${userName}</strong>,<br><br>The task <strong>“${taskTitle}”</strong> was updated by <strong>${updatedBy}</strong>.`,
    "View Task",
    `/tasks/${taskId}`,
    `<div style="background-color:#f3e8ff;border-left:4px solid #7c3aed;padding:14px 18px;border-radius:8px;margin:20px 0;">
       <strong>Status:</strong> ${newStatus}<br>
       <strong>Due Date:</strong> ${dueDate}<br>
       <strong>Update:</strong> ${description}
     </div>`
  );

const taskDeletedTemplate = (userId, userName, deletedBy, taskTitle) =>
  baseEmailTemplate(
    userId,
    "❌ Task Deleted",
    `Hi <strong>${userName}</strong>,<br><br>The task <strong>“${taskTitle}”</strong> has been deleted by <strong>${deletedBy}</strong>.`,
    null,
    null
  );

const registrationTemplate = (userId, userName) =>
  baseEmailTemplate(
    userId,
    "🎉 Welcome to Task Manager",
    `Hi <strong>${userName}</strong>,<br><br>Welcome aboard! Your account has been successfully registered. Start managing your tasks efficiently.`,
    "Go to Dashboard",
    `/`
  );

const onFollowTemplate = (userId, userName, followerName) =>
  baseEmailTemplate(
    userId,
    "👋 You Have a New Follower!",
    `Hi <strong>${userName}</strong>,<br><br><strong>${followerName}</strong> just followed you.`,
    "View Profile",
    `/users/followers?q=${followerName}`
  );

const onUnfollowTemplate = (userId, userName, unfollowerName) =>
  baseEmailTemplate(
    userId,
    "👋 Someone Unfollowed You",
    `Hi <strong>${userName}</strong>,<br><br><strong>${unfollowerName}</strong> has unfollowed you.`,
    null,
    null
  );

const userApprovalRequestTemplate = (adminId, adminName, userName, userEmail, userId) =>
  baseEmailTemplate(
    adminId,
    "🔔 New User Registration Request",
    `Hi <strong>${adminName}</strong>,<br><br>A new user <strong>${userName}</strong> (${userEmail}) has requested to join your organization.`,
    "Review Request",
    `/admin/pending-users`,
    `<div style="background-color:#f3e8ff;border-left:4px solid #7c3aed;padding:14px 18px;border-radius:8px;margin:20px 0;">
       <strong>User Details:</strong><br>
       Name: ${userName}<br>
       Email: ${userEmail}
     </div>`
  );

const userApprovedTemplate = (userId, userName) =>
  baseEmailTemplate(
    userId,
    "🎉 Account Approved - Welcome to Task Manager",
    `Hi <strong>${userName}</strong>,<br><br>Your account has been approved! You can now log in to your Task Manager account.`,
    "Log In",
    `/login`
  );

const userRejectedTemplate = (userName, reason) =>
  baseEmailTemplate(
    null,
    "❌ Account Rejected",
    `Hi <strong>${userName}</strong>,<br><br>Unfortunately, your registration request has been rejected.`,
    null,
    null,
    `<div style="background-color:#ffe8e8;border-left:4px solid #ff4848;padding:14px 18px;border-radius:8px;margin:20px 0;">
       <strong>Reason:</strong> ${reason}
     </div>`
  );

module.exports = {
  taskCreatedTemplate,
  taskUpdatedTemplate,
  taskDeletedTemplate,
  registrationTemplate,
  onFollowTemplate,
  onUnfollowTemplate,
  userApprovalRequestTemplate,
  userApprovedTemplate,
  userRejectedTemplate,
};
