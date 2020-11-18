import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// import TaskDetails from '../TaskDetails.js';

export default class MyTaskTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTask: null
        }
    }

    convertDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString([],options);
    }

    render() {
        return (
            <div>
                <table className='task-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Task Title</th>
                            <th>Project</th>
                            <th>Team</th>
                            <th>Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.userTasks?.map(task =>
                                <tr key={`userTask${task._id}`}>
                                    <td>X</td>
                                    <td>{task.title}</td>
                                    <td>{task.project?.name}</td>
                                    <td>{task.project?.team.name}</td>
                                    <td>{this.convertDate(task.dueDate)}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <td><FontAwesomeIcon icon={faPlusCircle} /></td>
                            <td colSpan="4" >Add a task</td>
                        </tr>
                        <tr></tr>
                    </tbody>
                </table>
                
            </div>
        )
    }
}
