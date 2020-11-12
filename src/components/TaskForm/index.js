import React, { Component } from 'react';
// import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';

export default class TaskForm extends Component {
    state = {
        title: '',
        description: '',
        dueDate: '',
        project: this.props.currentProject?._id,
        assigned: '',
        checklist: [],
        isComplete: false,
        teamMembers: null
    }

    componentDidMount = () => {
        
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const assignedID = event.target.parentNode.childNodes[2].childNodes[1].value;
        const { 
            title, 
            description, 
            project,
            dueDate,
            checklist,
            isComplete
         } = this.state;

        TASK_SERVICE
            .createTask({ title, description, project, dueDate, assigned: assignedID, checklist, isComplete })
            .then(projectFromServer => {
                const { task } = projectFromServer.data;
                // console.log({ task });
                this.props.addNewTask(task);
                modalClasslist.remove('display');
                this.setState({
                    title: '',
                    description: '',
                    dueDate: '',
                    assigned: '',
                    checklist: [],
                });
            })
            .catch(err => console.log({ err }));
    }

    cancelForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        // console.log({cancelForm: modalClasslist});

        modalClasslist.remove('display');
        
        this.setState({
            title: '',
            description: '',
            dueDate: '',
            assigned: '',
            checklist: [],
        });
    }

    render() {
        // console.log("team members", this.props.currentProject?.team.members)
        return (
            <div className='modal'>
                <div className='modal-content' onSubmit={this.handleFormSubmit}>
                    <input 
                        name='title' 
                        type='text'
                        placeholder='Task title'
                        value={this.state.title}
                        onChange={this.handleInputChange}/>
                    <input 
                        name='description' 
                        type='text'
                        placeholder='Task description'
                        value={this.state.description}
                        onChange={this.handleInputChange}/>
                    <div>
                        <label htmlFor="assigned">Assign task:</label>
                        <select name="assigned" id="assigned">
                            <option value={null}></option>
                            {
                                this.props.currentProject?.team.members?.map(member => 
                                <option key={member._id} value={member._id} >{member.firstName} {member.lastName}</option>)
                            }
                        </select>
                    </div>
                    <input 
                        name='dueDate' 
                        type='date'
                        placeholder='dueDate'
                        value={this.state.dueDate}
                        onChange={this.handleInputChange}/>
                    <button onClick={this.cancelForm}> Cancel </button>
                    <button onClick={this.handleFormSubmit}> Create a new task </button>
                </div>                
            </div>
        )
    }
}
