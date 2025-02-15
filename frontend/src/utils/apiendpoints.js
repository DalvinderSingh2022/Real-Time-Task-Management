import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}api`;
const token = localStorage.getItem('jwt');

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
    },
});

export const users = {
    register: (data) => axiosInstance.post('/users/register', data),
    login: (data) => axiosInstance.put('/users/login', data),
    all: () => axiosInstance.get('/users/all'),
    current: () => axiosInstance.get('/users/current'),
    follow: (userId) => axiosInstance.post(`/users/follow/${userId}`),
    unfollow: (userId) => axiosInstance.post(`/users/unfollow/${userId}`),
    update: (data) => axiosInstance.put(`/users`, data),
    delete: () => axiosInstance.delete(`/users`),
};

export const tasks = {
    all: () => axiosInstance.get('/tasks/all'),
    create: (data) => axiosInstance.post('/tasks', data),
    get: (id) => axiosInstance.get(`/tasks/${id}`),
    update: (id, data) => axiosInstance.put(`/tasks/${id}`, data),
    delete: (id) => axiosInstance.delete(`/tasks/${id}`),
};

export const comments = {
    get: (taskId) => axiosInstance.get(`/comments/${taskId}`),
    create: (taskId, data) => axiosInstance.post(`/comments/${taskId}`, data),
};

export const notifications = {
    all: () => axiosInstance.get('/notifications/all'),
    update: (id, data) => axiosInstance.put(`/notifications/${id}`, data),
    delete: (id) => axiosInstance.delete(`/notifications/${id}`),
    assignTask: (data) => axiosInstance.post('/notifications/assign-task', data),
    updateTask: (data) => axiosInstance.post('/notifications/update-task', data),
    deleteTask: (data) => axiosInstance.post('/notifications/delete-task', data),
    followUser: (data) => axiosInstance.post('/notifications/follow-user', data),
    unfollowUser: (data) => axiosInstance.post('/notifications/unfollow-user', data)
};