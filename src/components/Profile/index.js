import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import TEAM_SERVICE from '../../services/TeamService';
// import TeamForm from '../TeamForm';
// import ProjectForm from '../ProjectForm';
// import TaskForm from '../TaskForm';
import PROJECT_SERVICE from '../../services/ProjectService';

export default class Profile extends Component {
    state = {
        teams: [],
        projects: [],
        tasks: [],
    }

    componentDidMount = async () => {
        await AUTH_SERVICE
            .getAuthenticatedUser()
            .then(userFromServer => {
                const { user } = userFromServer.data;
                // console.log({ user });
                this.props.onUserChange(user)
            })
            .catch(err => console.log({ err }));

        // get all user teams
        await TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                // console.log({ teams });

                this.setState((preState) => ({
                    teams: preState.teams.concat(teams)
                }));
                
                const userTeamIDs = this.state.teams.map(team => team._id);
                // console.log({ userTeamIDs });

                // get all team projects
                userTeamIDs.forEach(async teamId => {     

                    await PROJECT_SERVICE
                        .getTeamProjects(teamId)
                        .then(responseFromServer => {
                            const { projects } = responseFromServer.data;
                            // console.log({ projects });
        
                            projects &&
                            this.setState((preState) => ({
                                projects: preState.projects.concat(projects)
                            }));                            
                        })
                        .catch(err => console.log({ err }));
                });
            })
            .catch(err => console.log({ err }));
    }

    newTeam = (team) => {
        const { teams } = this.state;
        this.setState({ teams: [...teams, team] });
    }

    newProject = (project) => {
        const { projects } = this.state;
        this.setState({ projects: [...projects, project] });
    }

    newTask = (task) => {
        const { tasks } = this.state;
        this.setState({ tasks: [...tasks, task] });
    }

    handleCurrentTeamChange = (event) => {
        const { value } = event.target;
        const { teams } = this.state;
        const team = teams.filter(team => team._id === value)[0];
        this.props.updateCurrentTeam(team)
    }

    handleCurrentProjectChange = (event) => {
        const { value } = event.target;
        const { projects } = this.state;
        const project = projects.filter(project => project._id === value)[0];
        this.props.updateCurrentProject(project);
        
        TASK_SERVICE
            .getProjectTasks(project._id)
            .then(responseFromServer => {
                const { tasks } = responseFromServer.data;
                this.setState({ tasks });
            })
            .catch(err => console.log({ err }));
    }

    render() {
        return (
            <div className='main-panel'>
                <h2>Profile page of {this.props.currentUser.firstName}</h2>                
            </div>
        )
    }
}
