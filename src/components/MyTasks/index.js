import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import MyTaskTable from './MyTaskTable';

export default class MyTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: null,
            sortedTasks: null,
            ascendingDate: false
        }
    }

    componentDidMount = () => {
        Promise
            .all([AUTH_SERVICE.getAuthenticatedUser(), TASK_SERVICE.getAllUserTasks()])
            .then(responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { tasks } = responseFromServer[1].data;
                // console.log({ tasks });
                this.props.onUserChange(user);
                tasks.forEach(task => { task.dueDate = new Date(task.dueDate) });
                tasks.sort((a, b) => a.dueDate - b.dueDate);
                this.setState({ 
                    tasks, 
                    sortedTasks: tasks 
                });
            })
            .catch(err => console.log({ err }));
    }

    sortByDate = () => {
        const { tasks, ascendingDate } = this.state;

        ascendingDate
        ? tasks.sort((a, b) => a.dueDate - b.dueDate)
        : tasks.sort((a, b) => b.dueDate - a.dueDate)
        
        // console.log('sorted tasks', tasks);
        this.setState({ 
            sortedTasks: tasks,
            ascendingDate: !ascendingDate
        })
    }

    render() {
        return (
            <div className='main-panel'>
                <MyTaskTable 
                    parentProps={this.props}
                    userTasks={this.state.sortedTasks} 
                    ascendingDate={this.state.ascendingDate} 
                    sortByDate={this.sortByDate}/>
            </div>
        )
    }
}
