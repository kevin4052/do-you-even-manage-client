import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const TEAM_SERVICE = {
  createTeam(teamData) {
    return service.post('/api/team', teamData);
  },
  getAllTeams(teamData) {
    return service.get('/api/team', teamData);
  },
  getUserTeams(userData) {
    return service.get('/api/team', userData);
  },
  getOneTeam(teamData) {
    return service.get(`/api/team/${teamData}`);
  },
  deleteTeam(teamData) {
    return service.post(`/api/team/${teamData}/delete`, {});
  },
  updateTeam(teamData) {
    return service.post(`/api/team/${teamData}/update`, {});
  }
};

export default TEAM_SERVICE;