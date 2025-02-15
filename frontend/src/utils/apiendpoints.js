const BASE_URL = process.env.REACT_APP_API_BASE_URL + 'api';

export const users = {
    current_user: BASE_URL + '/users/current',
    all_users: BASE_URL + '/users/all',
    login_user: BASE_URL + '/users/login',
    register_user: BASE_URL + '/users/register',
    delete_user: (id) => BASE_URL + '/users/' + id,
    follow_user: (id) => BASE_URL + '/users/follow/' + id,
    unfollow_user: (id) => BASE_URL + '/users/unfollow/' + id,
    update_user: (id) => BASE_URL + '/users/' + id,
}

export const tasks = {
    create_task: BASE_URL + '/tasks',
    update_task: (id) => BASE_URL + '/tasks/' + id,
    delete_task: (id) => BASE_URL + '/tasks/' + id,
    get_task: (id) => BASE_URL + '/tasks/' + id,
    all_tasks: (userId) => BASE_URL + '/tasks/all/' + userId,
}

export const comments = {
    get_comments: (taskId) => BASE_URL + '/comments/' + taskId,
    create_comment: (taskId) => BASE_URL + '/comments/' + taskId,
}

export const notifications = {
    due_date_reminder: BASE_URL + '/notifications/due-date-reminder',
    assign_task: BASE_URL + '/notifications/assign-task',
    follow_user: BASE_URL + '/notifications/follow-user',
    unfollow_user: BASE_URL + '/notifications/unfollow-user',
    update_task: BASE_URL + '/notifications/update-task',
    delete_task: BASE_URL + '/notifications/delete-task',
    update_notification: (id) => BASE_URL + '/notifications/' + id,
    delete_notifications: (id) => BASE_URL + '/notifications/' + id,
    all_notifications: (userId) => BASE_URL + '/notifications/all/' + userId,
};