import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const PROJECT_SERVICE = {
  createProject(projectData) {
    return service.post('/api/projects', projectData);
  },
  getAllProjects() {
    return service.get('/api/projects');
  },
  getTeamProjects(teamId) {
    return service.get(`/api/team-projects/${teamId}`);
  },
  getOneProject(projectId) {
    return service.get(`/api/projects/${projectId}`);
  },
  deleteProject(projectId) {
    return service.post(`/api/projects/${projectId}/delete`);
  },
  updateProject(projectId, projectData) {
    return service.post(`/api/projects/${projectId}/update`, {projectData});
  }
};

export default PROJECT_SERVICE;