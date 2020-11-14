import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const TEAM_SERVICE = {
  createTeam(teamData) {
    return service.post('/api/teams', teamData);
  },
  getAllTeams() {
    return service.get('/api/teams');
  },
  getUserTeams() {
    return service.get('/api/user-teams');
  },
  getOneTeam(teamData) {
    return service.get(`/api/teams/${teamData}`);
  },
  deleteTeam(teamData) {
    return service.post(`/api/teams/${teamData}/delete`, {});
  },
  updateTeam(teamId, teamData) {
    return service.post(`/api/teams/${teamId}/update`, {teamData});
  },
  removeTeamMember(teamId, teamData) {
    return service.post(`/api/teams/${teamId}/remove-member`, {teamData});
  }
};

export default TEAM_SERVICE;