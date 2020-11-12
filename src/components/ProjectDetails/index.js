import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import PROJECT_SERVICE from '../../services/ProjectService';
// import TASK_SERVICE from '../../services/TaskService';
import TaskForm from '../TaskForm';

export default class ProjectDetails extends Component {
    state = {
        project: null
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

    render() {
        // console.log(this.state?.project);
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <h3>Project name: {this.state.project?.name}</h3>
                    <ul>
                        <li>description: {this.state.project?.description}</li>
                        <li>team: {this.state.project?.team.name}</li>
                        <li>Tasks: <button onClick={this.displayTaskForm}>Add new Task</button>
                            <ul>
                                {
                                    this.state.project?.tasks.map(task => 
                                    <li key={task._id}>
                                        <div><b>Task Title:</b> {task.title}</div>
                                        <div><b>Task description</b>: {task.description}</div>
                                        <div><b>Completed:</b> {task.isCompleted ? 'yes' : 'no'}</div>
                                        <div><b>Started:</b> {task.createdAt}</div>
                                        <div><b>checklist:</b>
                                            <ul>
                                                {
                                                    task.checklist.map(item => <li key={item}>{item}</li>)
                                                }
                                            </ul>
                                        </div>
                                    </li>)
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
                <TaskForm
                    addNewTask={this.addNewTask}
                    currentUser={this.props.currentUser}
                    currentProject={this.state.project}/>
            </div>
        )
    }
}
