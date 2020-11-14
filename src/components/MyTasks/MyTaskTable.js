import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default class MyTaskTable extends Component {

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
                        <tr>
                            <td><FontAwesomeIcon icon={faPlusCircle} /></td>
                            <td colSpan="4" >Add a task</td>
                        </tr>
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
                        <tr></tr>
                    </tbody>
                </table>
                
            </div>
        )
    }
}
