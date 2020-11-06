import React, { Component } from 'react';
import TASK_SERVICE from '../../services/TaskService';

export default class TaskForm extends Component {
    state = {
        title: '',
        description: '',
        dueDate: '',
        project: this.props.currentProject?._id,
        assigned: '',
        checklist: [],
        isComplete: false
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { title, description, project } = this.state;

        TASK_SERVICE
            .createTask({ title, description, project })
            .then(projectFromServer => {
                const { task } = projectFromServer.data;
                console.log({ task });
                this.props.newTask(task);
                this.setState({ 
                    title: '',
                    description: ''
                });
            })
            .catch(err => console.log({ err }));

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        {/* Title */}
                        <input 
                            name='title' 
                            type='text'
                            placeholder='task title'
                            value={this.state.title}
                            onChange={this.handleInputChange}/>
                    </label>
                    <label>
                        {/* Description */}
                        <input 
                            name='description' 
                            type='text'
                            placeholder='task description'
                            value={this.state.description}
                            onChange={this.handleInputChange}/>
                    </label>
                    {/* <label>
                        dueDate
                        <input 
                            name='dueDate' 
                            type='text'
                            placeholder='dueDate'
                            value={this.state.taskForm.tile}
                            onChange={this.handleTaskInputChange}/>
                    </label> */}
                    <button> Create a new task </button>
                </form>                
            </div>
        )
    }
}
