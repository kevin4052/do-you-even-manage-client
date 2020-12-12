import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import PROJECT_SERVICE from '../../services/ProjectService';
import TaskDetails from '../TaskDetails.js';
// import TASK_SERVICE from '../../services/TaskService';
import TaskForm from '../TaskForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import TASK_SERVICE from '../../services/TaskService';

export default class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            completedTasks: null,
            toDoTasks: null,
            inProgressTasks: null
        }
    }

    componentDidMount = () => {
        const { projectId } = this.props.match.params;
        // console.log({ projectId })

        Promise
            .all([AUTH_SERVICE.getAuthenticatedUser(), PROJECT_SERVICE.getOneProject(projectId)])
            .then(responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { project } = responseFromServer[1].data;

                // console.log({ project });
                const toDoTasks = project.tasks.filter(task => task.status === 'todo');
                const inProgressTasks = project.tasks.filter(task => task.status === 'inProgress');
                const completedTasks = project.tasks.filter(task => task.status === 'complete');

                this.setState({ 
                    project,
                    toDoTasks,
                    inProgressTasks,
                    completedTasks
                 });
                this.props.onUserChange(user);
                //  console.log('new state');
            })
            .catch(err => console.log({ err }));
    }

    addNewTask = (task) => {
        this.componentDidMount();
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

    updateProject = () => {

        console.log('update project')
        this.componentDidMount();
    }

    deleteTask = (event) => {
        const { tasks } = this.state.project;
        const taskName = event.target.parentNode.parentNode.childNodes[1].innerText;
        // console.log({ taskName });
        const taskToDelete = tasks.filter(task => task.title === taskName)[0];

        TASK_SERVICE
        .deleteTask(taskToDelete._id)
        .then(() => this.componentDidMount())
        .catch(err => console.log({ err }));
    }

    taskStatusColor = (dueDate) => {
        // console.log(dueDate)
        const today = new Date();
        const taskDate = new Date(dueDate);
        const statusClass = ['good', 'due', 'late'];
        const delta = Math.floor((taskDate - today) / (1000 * 3600 * 24));

        // console.log('delta', delta)

        return delta <= 0 
        ? statusClass[2]
        : delta <= 7
        ? statusClass[1]
        : statusClass[0]
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
                                        this.state.toDoTasks?.map(task => 
                                        <div className='task-card' key={`todo${task._id}`} task={task._id}>
                                            <button className={this.taskStatusColor(task.dueDate)} onClick={this.displayTask}></button>
                                            <div>
                                                <h4>{task.title}</h4>
                                                <p>{this.convertDate(task.dueDate)}</p>
                                            </div>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                updateProject={this.updateProject}
                                                currentlyAssigned={task.assigned._id}
                                                task={task}/>
                                            <div className='delete-btn'>
                                                <FontAwesomeIcon icon={faTimesCircle} onClick={this.deleteTask} />
                                            </div>
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
                                        this.state.inProgressTasks?.map(task => 
                                        <div className='task-card' key={`progess${task._id}`} task={task._id}>
                                            <button className={this.taskStatusColor(task.dueDate)} onClick={this.displayTask}></button>
                                            <div>
                                                <h4>{task.title}</h4>
                                                <p>{this.convertDate(task.dueDate)}</p>
                                            </div>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                updateProject={this.updateProject}
                                                currentlyAssigned={task.assigned._id}
                                                task={task}/>
                                            <div className='delete-btn'>
                                                <FontAwesomeIcon icon={faTimesCircle} onClick={this.deleteTask} />
                                            </div>
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
                                        this.state.completedTasks?.map(task => 
                                        <div className='task-card' key={`complete${task._id}`}>
                                            <button className={this.taskStatusColor(task.dueDate)} onClick={this.displayTask}></button>
                                            <div>
                                                <h4>{task.title}</h4>
                                                <p>{this.convertDate(task.dueDate)}</p>
                                            </div>
                                            <TaskDetails 
                                                currentProject={this.state.project} 
                                                updateUserTeams={this.updateUserTeams} 
                                                updateProject={this.updateProject}
                                                currentlyAssigned={task.assigned._id}
                                                task={task}/>
                                            <div className='delete-btn'>
                                                <FontAwesomeIcon icon={faTimesCircle} onClick={this.deleteTask} />
                                            </div>
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
