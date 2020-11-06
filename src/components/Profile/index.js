import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import TEAM_SERVICE from '../../services/TeamService';
import TeamForm from '../TeamForm';
import ProjectForm from '../ProjectForm';

export default class Profile extends Component {
    state = {
        teams: [],
        projects: [],
        tasks: [],
        taskForm: {
            title: '',
        },
    }

    componentDidMount = () => {
        AUTH_SERVICE
            .getAuthenticatedUser()
        TASK_SERVICE
            .getAllTasks()
            .then(responseFromServer => {
                const { tasks } = responseFromServer.data;
                console.log({ tasks });
                this.setState({ tasks });
            })
            .catch(err => console.log({ err }));

        TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                console.log({ teams });
                this.setState({ teams });
            })
            .catch(err => console.log({ err }));
    }

    handleTaskInputChange = event => {
        const { name, value } = event.target;
        const { taskForm } = this.state;
        taskForm[name] = value;
        console.log(taskForm);
        this.setState({ taskForm });
    }

    handleFormSubmit = event => {
        event.preventDefault();
        const { taskForm } = this.state;

        TASK_SERVICE
            .createTask(taskForm)
            .then(responseFromServer => {
                const { task } = responseFromServer.data;
                console.log({ task });
                this.setState((preState => ({
                    tasks: preState.tasks.concat(task),
                    title: ''
                })));
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

    handleCurrentTeamChange = (event) => {
        const { value } = event.target;
        const { teams } = this.state;
        const team = teams.filter(team => team._id === value)[0];
        this.props.updateCurrentTeam(team)
    }

    handleCurrentProjectChange = (event) => {
        const { value } = event.target;
        const { projects } = this.state;
        const team = projects.filter(team => team._id === value)[0];
        this.props.updateCurrentProject(team)
    }

    render() {
        return (
            <div>
                <h2>Profile page of {this.props.currentUser.firstName}</h2>
                <div>
                    <div className='team-section'>
                        <TeamForm currentUser={this.props.currentUser} newTeam={this.newTeam}/>                        
                        <div className='teams'>
                            <h4>Your Teams</h4>
                            <div className='team-list'>
                                {   // should only display teams related to the currently authenticated user
                                    this.state.teams.map(team => 
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
                        <ProjectForm currentUser={this.props.currentUser} newProject={this.newProject}/>                        
                        <div className='projects'>
                            <h4>Your Teams</h4>
                            <div className='project-list'>
                                {   // should only display projects related to the currently selected team
                                    this.state.projects.map(project => 
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
                        <form onSubmit={this.handleFormSubmit}>
                            <label>
                                Task Title
                                <input 
                                    name='title' 
                                    type='text'
                                    placeholder='task title'
                                    value={this.state.taskForm.tile}
                                    onChange={this.handleTaskInputChange}/>
                            </label>
                            <button> add a new task </button>
                        </form>
                        <div className='tasks'>
                            <h4>Tasks</h4>
                            <ul className='task-list'>
                                {   // should only display task related to the currently selected project
                                    this.state.tasks.map(task => 
                                    <li key={task._id}>{task.title}, complete: {task.isComplete ? 'yes' : 'no'}</li>
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
