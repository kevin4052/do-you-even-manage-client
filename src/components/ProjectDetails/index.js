import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import PROJECT_SERVICE from '../../services/ProjectService';
import TaskDetails from '../TaskDetails.js';
// import TASK_SERVICE from '../../services/TaskService';
import TaskForm from '../TaskForm';

export default class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null
        }
    }

    componentDidMount = () => {
        const { projectId } = this.props.match.params;
        // console.log({ projectId })

        Promise
            .all([AUTH_SERVICE.getAuthenticatedUser(), PROJECT_SERVICE.getOneProject(projectId)])
            .then(async responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { project } = responseFromServer[1].data;

                // console.log({ project });

                this.props.onUserChange(user);
                // this.props.updateCurrentProject(project);
                await this.setState({ project });
            })
            .catch(err => console.log({ err }));
    }

    addNewTask = (task) => {
        const { project } = this.state;
        project.tasks.push(task);
        this.setState({ project });
    }

    displayTaskForm = (event) => {
        // display task form modal
        const modalClasslist = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].classList;
        // console.log({ modalClasslist });
        modalClasslist.contains('display')
        ? modalClasslist.remove('display')
        : modalClasslist.add('display')
    }

    displayTask = (event) => {
        const modalClasslist = event.target.parentNode.childNodes[2].classList;
        modalClasslist.contains('display')
        ? modalClasslist.remove('display')
        : modalClasslist.add('display')
    }

    convertDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString([],options);
    }

    updateUserTeams = (teams) => {
        this.props.updateUserTeams(teams);
        this.componentDidMount();
    }

    render() {
        // console.log(this.state?.project);
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <div className='task-board'>
                        <div className='task-board-header'>
                            <h3>{this.state.project?.name}</h3>
                            <button onClick={this.displayTaskForm}>Add new Task</button>
                        </div>
                        <div className='task-board-body'>
                            <div className='col'>
                                <div className='col-header'>
                                    <h5>ToDo</h5>
                                </div>
                                <div className='col-body'>
                                    {/* list of items */}
                                    {
                                        this.state.project?.tasks.map(task => 
                                        <div className='task-card' key={`todo${task._id}`} task={task._id}>
                                            <button onClick={this.displayTask}></button>
                                            <p>{task.title}</p>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                task={task}/>
                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='col'>
                                <div className='col-header'>
                                    <h5>In Progress</h5>
                                </div>
                                <div className='col-body'>
                                    {/* list of items */}
                                    {
                                        this.state.project?.tasks.map(task => 
                                        <div className='task-card' key={`progess${task._id}`} task={task._id}>
                                            <button onClick={this.displayTask} ></button>
                                            <p>{task.title}</p>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                task={task}/>
                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='col'>
                                <div className='col-header'>
                                    <h5>Completed</h5>
                                </div>
                                <div className='col-body'>
                                    {/* list of items */}
                                    {
                                        this.state.project?.tasks.map(task => 
                                        <div className='task-card' key={`complete${task._id}`}>
                                            <button onClick={this.displayTask}></button>
                                            <p>{task.title}</p>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                task={task}/>
                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <TaskForm
                    addNewTask={this.addNewTask}
                    currentUser={this.props.currentUser}
                    currentProject={this.state.project}/>
                
            </div>
        )
    }
}
