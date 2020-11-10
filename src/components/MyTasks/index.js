import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';

export default class MyTasks extends Component {
    state = {
        tasks: null
    }

    componentDidMount = () => {
        Promise
            .all([AUTH_SERVICE.getAuthenticatedUser(), TASK_SERVICE.getAllUserTasks()])
            .then(async responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { tasks } = responseFromServer[1].data;

                console.log({ tasks })

                this.props.onUserChange(user);
                await this.setState({ tasks });
            })
            .catch(err => console.log({ err }));
    }

    render() {
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <ul>
                        {
                            this.state.tasks?.map(task => 
                            <li key={task._id}>{task.title}</li>)
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
