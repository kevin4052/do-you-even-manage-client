import React, { Component } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';

export default class MyTaskTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTask: null,
            sortedTasks: null,
            newTask: false
        }
    }

    convertDate = (date) => {
        const convertedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1);
        return convertedDate;
        // console.log({ convertedDate })
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // return new Date(date).toLocaleDateString([],convertedDate);
    }

    toggleForm = () => {
        const { newTask } = this.state;
        this.setState({ newTask: !newTask });
    }

    sortByDate = () => {
        this.props.sortByDate();
    }

    goToProject = (task) => {
        // console.log('goToProject', task);
        this.props.parentProps.history.push(`/project/${task.project._id}`);
    }

    render() {
        const { ascendingDate } = this.props;
        return (
            <div className='my-tasks'>
                <table className='my-tasks-table'>
                    <thead>
                        <tr>
                            <th>
                                <p>Task Title</p>
                            </th>
                            <th>
                                <p>Project</p>
                            </th>
                            <th>
                                <p>Team</p>
                            </th>
                            <th>
                                <div className='table-head'>
                                    <p onClick={this.sortByDate}>Due</p>
                                    {
                                        ascendingDate
                                        ?<FontAwesomeIcon icon={faSortUp} />
                                        :<FontAwesomeIcon icon={faSortDown} />
                                    }                                    
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.userTasks?.map(task =>
                                <tr key={`userTask${task._id}`} className='new-project' onClick={() => this.goToProject(task)}>
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
