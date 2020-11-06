import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import TEAM_SERVICE from '../../services/TeamService';
import TeamForm from '../TeamForm';
import ProjectForm from '../ProjectForm';
import TaskForm from '../TaskForm';
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
                console.log({ user });
                this.props.onUserChange(user)
            })
            .catch(err => console.log({ err }));

        // get all user teams
        await TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                console.log({ teams });

                this.setState((preState) => ({
                    teams: preState.teams.concat(teams)
                }));
                
                const userTeamIDs = this.state.teams.map(team => team._id);
                console.log({ userTeamIDs });

                // get all team projects
                userTeamIDs.forEach(async teamId => {     

                    await PROJECT_SERVICE
                        .getTeamProjects(teamId)
                        .then(responseFromServer => {
                            const { projects } = responseFromServer.data;
                            console.log({ projects });
        
                            projects &&
                            this.setState((preState) => ({
                                projects: preState.projects.concat(projects)
                            }));                            
                        })
                        .catch(err => console.log({ err }));

                    const teamProjectIDs = this.state.projects?.map(project => project._id);
                    console.log({ teamProjectIDs });
            
                    // get all project tasks
                    teamProjectIDs.forEach(async projectId => {
            
                        await TASK_SERVICE
                            .getProjectTasks(projectId)
                            .then(responseFromServer => {
                                const { tasks } = responseFromServer.data;
                                console.log('profile component did mount tasks', { tasks });
                                this.setState((preState) => ({
                                    tasks: preState.tasks.concat(tasks) || []
                                }));
                            })
                            .catch(err => console.log({ err }));
                    })
                });
            })
            .catch(err => console.log({ err }));

        console.log(this.state)
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
    }

    render() {
        return (
            <div>
                <h2>Profile page of {this.props.currentUser.firstName}</h2>
                <div style={{display: "flex"}}>

                    <div className='team-section'>
                        <TeamForm 
                            currentUser={this.props.currentUser} 
                            newTeam={this.newTeam}/>                        
                        <div className='teams'>
                            <h4>Your Teams</h4>
                            <div className='team-list'>
                                {   // should only display teams related to the currently authenticated user
                                    this.state.teams?.map(team => 
                                        <label key={team._id}>
                                            <input type="radio" name='teams' onChange={this.handleCurrentTeamChange} value={team._id} />
                                            {team.name}
                                        </label>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='project-section'>
                        {
                            this.props.currentTeam &&
                            <ProjectForm 
                                currentUser={this.props.currentUser} 
                                currentTeam={this.props.currentTeam} 
                                newProject={this.newProject}/>
                        }
                        <div className='projects'>
                            <h4>Your Projects</h4>
                            <div className='project-list'>
                                {   // should only display projects related to the currently selected team
                                    this.state.projects?.map(project => 
                                        <label key={project._id}>
                                            <input type="radio" name='projects' onChange={this.handleCurrentProjectChange} value={project._id} />
                                            {project.name}
                                        </label>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='task-section'>
                        {
                            this.props.currentProject &&
                            <TaskForm 
                                currentProject={this.props.currentProject}
                                newTask={this.newTask}/>
                        }
                        <div className='tasks'>
                            <h4>Tasks</h4>
                            <ul className='task-list'>
                                {   // should only display task related to the currently selected project
                                    this.state.tasks?.map(task => 
                                    <li key={task._id}>{task.title}</li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
