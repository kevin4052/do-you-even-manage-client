import React, { Component } from 'react';
// import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
// import TEAM_SERVICE from '../../services/TeamService';


export default class TaskDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            dueDate: '',
            assigned: '',
            checklist: [],
            status: '',
            teamMembers: null
        }
    }

    componentDidMount = () => {
        const { 
            title, 
            description, 
            dueDate,
            assigned,
            checklist
        } = this.props.task;

        console.log({assigned})

        const date = new Date(dueDate);
        const convertedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1);

        this.setState({
            title, 
            description, 
            dueDate: convertedDate,
            assigned,
            checklist
        });        
    }

    componentDidUpdate = () => {
        if (this.state.assigned._id !== this.props.currentlyAssigned) {
            this.componentDidMount();
        }
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleCheckBoxInput = (event) => {
        const index = event.target.parentNode.attributes.index.value;
        const { checklist } = this.state;
        checklist[index].isComplete = !checklist[index].isComplete;
        // console.log({ checklist })
        this.setState({ checklist });
    }

    handleFormSubmit = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const assignedID = event.target.parentNode.childNodes[3].childNodes[1].value;
        const selectedStatus = event.target.parentNode.childNodes[5].childNodes[1].value

        console.log({ selectedStatus })
        const { 
            title, 
            description,
            dueDate,
            checklist,
         } = this.state;

        //  console.log(modalClasslist)
        console.log({assignedID})

        TASK_SERVICE
        .updateTask(
            this.props.task._id,
            {   title, 
                description, 
                dueDate: new Date(dueDate), 
                assigned: assignedID || this.state.assigned._id, 
                checklist, 
                status: selectedStatus
            })
        .then(responseFromServer => {
            const { task } = responseFromServer.data;
            // console.log({ task });
            modalClasslist.remove('display');
            this.props.updateProject();
        })
        .catch(err => console.log({ err }));
    }

    cancelForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        // console.log({cancelForm: modalClasslist});

        modalClasslist.remove('display');
    }

    addItem = (event) => {
        const { checklist } = this.state;
        const input = event.target.parentNode.childNodes[1];
        const checkItem = input.value.trim();
        
        const checklistItem = {
            checkItem,
            isComplete: false
        }

        checklist.push(checklistItem);

        this.setState({ checklist });
        input.value = '';
    }

    render() {
        return (
            <div className='modal'>
                <div className='modal-content' onSubmit={this.handleFormSubmit}>
                    <label>Title:
                        <input 
                            name='title' 
                            type='text'
                            placeholder='Task title'
                            value={this.state.title}
                            onChange={this.handleInputChange}/>
                        </label>
                    <label htmlFor='description'>Description:</label>
                    <input 
                        name='description' 
                        type='text'
                        placeholder='Task description'
                        value={this.state.description}
                        onChange={this.handleInputChange}/>
                    <div>
                        <label htmlFor="assigned">Assigned</label>
                        <select name="assigned" id="assigned">
                            <option value={null}></option>
                            {
                                this.props.currentProject?.team.members?.map(member => 
                                <option key={`task${member._id}`} value={member._id} >{member.firstName} {member.lastName}</option>)
                            }
                        </select>
                        <br/>
                        <br/>
                        <div>Currently assigned: {this.state.assigned.firstName}</div>
                    </div>
                    <div className='checklist'>
                        <label></label>
                        <input type='text' placeholder='checklist item' />
                        <button onClick={this.addItem}>Add to do item</button>
                        <ul>
                            {
                                this.state.checklist.map((item, index) => 
                                <li key={`checkItem${item.checkItem}`} index={index}>
                                    <input 
                                        type='checkbox' 
                                        defaultChecked={item.isComplete}
                                        onChange={this.handleCheckBoxInput}
                                        />
                                        {item.checkItem}
                                </li>
                                )
                            }
                        </ul>
                    </div>
                    <div>
                        <label htmlFor="status">Task status: </label>
                        <select name="status" id="status">
                            <option value='todo'>not started</option>
                            <option value='inProgress'>In progress</option>
                            <option value='complete'>completed</option>
                        </select>
                    </div>
                    <input 
                        name='dueDate' 
                        type='date'
                        placeholder='dueDate'
                        value={this.state.dueDate}
                        onChange={this.handleInputChange}/>
                    <button onClick={this.cancelForm}> Cancel </button>
                    <button onClick={this.handleFormSubmit}> Save task </button>
                </div>                
            </div>
        )
    }
}