import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("jwt");
    
    if (token && error.response && error.response.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const users = {
  register: (data) => axiosInstance.post("/users/register", data),
  login: (data) => axiosInstance.put("/users/login", data),
  all: () => axiosInstance.get("/users/all"),
  current: () => axiosInstance.get("/users/current"),
  follow: (userId) => axiosInstance.post(`/users/follow/${userId}`),
  unfollow: (userId) => axiosInstance.post(`/users/unfollow/${userId}`),
  update: (data) => axiosInstance.put(`/users`, data),
  delete: () => axiosInstance.delete(`/users`),
};

export const tasks = {
  all: () => axiosInstance.get("/tasks/all"),
  create: (data) => axiosInstance.post("/tasks", data),
  get: (id) => axiosInstance.get(`/tasks/${id}`),
  update: (id, data) => axiosInstance.put(`/tasks/${id}`, data),
  delete: (id) => axiosInstance.delete(`/tasks/${id}`),
};

export const comments = {
  get: (taskId) => axiosInstance.get(`/comments/${taskId}`),
  create: (taskId, data) => axiosInstance.post(`/comments/${taskId}`, data),
};

export const notifications = {
  all: () => axiosInstance.get("/notifications/all"),
  update: (id, data) => axiosInstance.put(`/notifications/${id}`, data),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),
  assignTask: (data) => axiosInstance.post("/notifications/assign-task", data),
  updateTask: (data) => axiosInstance.post("/notifications/update-task", data),
  deleteTask: (data) => axiosInstance.post("/notifications/delete-task", data),
  followUser: (data) => axiosInstance.post("/notifications/follow-user", data),
  unfollowUser: (data) =>
    axiosInstance.post("/notifications/unfollow-user", data),
};
