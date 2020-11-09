import React, { Component } from 'react';

// import TEAM_SERVICE from '../../services/TeamService';
// import PROJECT_SERVICE from '../../services/ProjectService';
// import TASK_SERVICE from '../../services/TaskService';

export default class Home extends Component {
    state = {
        userTeams: [],
        userProjects: [],
        userTasks: []
    }

    componentDidMount = async () => {
    }

    render() {
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <div>
                       <h2>Home page</h2>
                        <h4>Welcome {this.props.currentUser?.firstname}</h4>
                    </div>
                </div>
            </div>
        )
    }
}
