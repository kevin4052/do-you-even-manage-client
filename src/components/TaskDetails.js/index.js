import React, { Component } from 'react';
// import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import TEAM_SERVICE from '../../services/TeamService';


export default class TaskDetails extends Component {
    state = {
        title: '',
        description: '',
        dueDate: '',
        assigned: '',
        checklist: [],
        isComplete: false,
        teamMembers: null
    }

    componentDidMount = () => {
        const { 
            title, 
            description, 
            dueDate,
            assigned,
            checklist,
            isComplete
        } = this.props.task;

        const date = new Date(dueDate);
        const convertedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        this.setState({
            title, 
            description, 
            dueDate: convertedDate,
            assigned,
            checklist,
            isComplete
        });        
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
        const { 
            title, 
            description,
            dueDate,
            checklist,
            isComplete
         } = this.state;

        //  console.log(modalClasslist)
         console.log(assignedID)

        TASK_SERVICE
        .updateTask(
            this.props.task._id,
            {   title, 
                description, 
                dueDate: new Date(dueDate), 
                assigned: assignedID, 
                checklist, 
                isComplete 
            })
        .then(responseFromServer => {
            const { task } = responseFromServer.data;
            console.log({ task });
            modalClasslist.remove('display');

            TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                this.props.updateUserTeams(teams)
            })
            .catch(err => console.log({ err }));
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
                    <div>
                        <label>Title:
                            <input 
                                name='title' 
                                type='text'
                                placeholder='Task title'
                                value={this.state.title}
                                onChange={this.handleInputChange}/>
                            </label>
                        <label>
                            <input type='checkbox' defaultChecked={this.state.isComplete} />
                            Complete
                        </label>
                        
                    </div>
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
                        <div>{this.state.assigned.firstName}</div>
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