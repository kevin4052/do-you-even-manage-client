import React, { Component } from 'react';
import TASK_SERVICE from '../../services/TaskService';
import TEAM_SERVICE from '../../services/TeamService';

export default class Profile extends Component {
    state = {
        tasks: [],
        teams: [],
        taskForm: {
            title: '',
        },        
        teamForm: {
            name: '',
            owner: '',
            members: []
        }
    }

    componentDidMount = () => {
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

    handleTeamInputChange = event => {
        const { name, value } = event.target;
        const { teamForm } = this.state;
        teamForm[name] = value;
        console.log(teamForm);
        this.setState({ teamForm });
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
                })))
            })
            .catch(err => console.log({ err }));
    }

    handleTeamFormSubmit = (event) => {
        event.preventDefault();
        const { teamForm } = this.state;
        teamForm.members.push(this.props.currentUser._id)

        TEAM_SERVICE
            .createTeam(teamForm)
            .then(teamFromServer => {
                const { team } = teamFromServer.data;
                console.log({ team });
                this.setState((preState) => ({
                    teams: preState.teams.concat(team)
                }));
            })
            .catch(err => console.log({ err }));

    }

    render() {
        return (
            <div>
                <h2>Profile page of {this.props.currentUser.firstName}</h2>
                <div>
                    <form onSubmit={this.handleTeamFormSubmit}>
                        <label>
                            Team name:
                            <input 
                                name='name' 
                                type='text'
                                placeholder='team name'
                                value={this.state.teamForm.name}
                                onChange={this.handleTeamInputChange}/>
                        </label>
                        <button> Create a Team </button>
                    </form>
                    {
                        this.state.teams &&
                        <div className='team-list'>
                            <h4>Your Teams</h4>
                            <div>
                                {
                                    this.state.teams.map(team => 
                                        <label>{team.name}
                                            <input key={team._id} type="checkbox" />
                                        </label>
                                    )
                                }
                            </div>
                        </div>
                        
                    }

                </div>
                <div className='task'>
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
                    {
                        this.state.tasks &&
                        <div className='task-list'>
                            <h4>Tasks</h4>
                            <ul>
                                {
                                    this.state.tasks.map(task => 
                                    <li key={task._id}>{task.title}, complete: {task.isComplete ? 'yes' : 'no'}</li>
                                    )
                                }
                            </ul>
                        </div>
                        
                    }
                </div>
            </div>
        )
    }
}
