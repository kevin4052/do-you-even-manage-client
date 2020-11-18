import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TASK_SERVICE from '../../services/TaskService';
import MyTaskTable from './MyTaskTable';

export default class MyTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: null
        }
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
                    <MyTaskTable userTasks={this.state.tasks}/>
                </div>
            </div>
        )
    }
}
