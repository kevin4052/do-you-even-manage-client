import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const TASK_SERVICE = {
  createTask(taskData) {
    return service.post('/api/tasks', taskData);
  },
  getAllTasks(taskData) {
    return service.get('/api/tasks', taskData);
  },
  getOneTask(taskId) {
    return service.get(`/api/tasks/${taskId}`);
  },
  deleteTask(taskId) {
    return service.post(`/api/tasks/${taskId}/delete`, {});
  },
  updateTask(taskId) {
    return service.post(`/api/tasks/${taskId}/update`, {});
  }
};

export default TASK_SERVICE;