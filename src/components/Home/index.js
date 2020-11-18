import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';

// import TEAM_SERVICE from '../../services/TeamService';
// import PROJECT_SERVICE from '../../services/ProjectService';
// import TASK_SERVICE from '../../services/TaskService';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userTeams: [],
            userProjects: [],
            userTasks: []
        }
    }

    componentDidMount = async () => {
        AUTH_SERVICE
            .getAuthenticatedUser()
            .then(responseFromServer => {
                const { user } = responseFromServer.data;
                this.props.onUserChange(user);
            })
            .catch(err => console.log({ err }));
    }

    render() {
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <div>
                       <h2>Home page</h2>
                        <h4>Welcome {this.props.currentUser?.firstName} {this.props.currentUser.lastName[0].toUpperCase()}</h4>
                    </div>
                </div>
            </div>
        )
    }
}
