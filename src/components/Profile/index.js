import React, { Component } from 'react';
import TASK_SERVICE from '../../services/TaskService';

export default class Profile extends Component {
    state = {
        tasks: null,
        title: ''
    }

    componentDidMount = () => {
        TASK_SERVICE
            .getAllTasks()
            .then(responseFromServer => {
                const { tasks } = responseFromServer.data;
                console.log({ tasks });
                this.setState({
                    tasks: tasks
                })
            })
            .catch(err => console.log({ err }));
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value});
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const { title } = this.state;

        const taskData = {
            title,
            creator: this.props.currentUser._id
        }

        TASK_SERVICE
            .createTask(taskData)
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

    render() {
        return (
            <div>
                <h2>Profile page</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Task Title
                        <input 
                            name='title' 
                            type='text'
                            placeholder='task title'
                            value={this.state.title}
                            onChange={this.handleInputChange}/>
                    </label>
                    <button> add a new task </button>
                </form>
                {
                    this.state.tasks &&
                    <div>
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
        )
    }
}
