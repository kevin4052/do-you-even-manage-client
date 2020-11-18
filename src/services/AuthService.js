import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const AUTH_SERVICE = {
  signup(userData) {
    return service.post('/api/signup', userData);
  },
  login(userData) {
    return service.post('/api/login', userData);
  },
  logout() {
    return service.post('/api/logout', {});
  },
  getAuthenticatedUser() {
    return service.get('/api/isLoggedIn');
  },
  getAllUsers() {
    return service.get('/api/get-users')
  },
  updateCurrentUser(userData) {
    return service.post(`/api/update-user`, userData)
  }
};

export default AUTH_SERVICE;