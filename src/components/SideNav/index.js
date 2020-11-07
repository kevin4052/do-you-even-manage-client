import React, { Component } from 'react';
import './style.css';
import AUTH_SERVICE from '../../services/AuthService';

export default class SideNav extends Component {
    state = {

    }

    logoutAndLiftUserState = () => {
        AUTH_SERVICE
            .logout()
            .then(() => this.props.onUserChange(null))
            .catch(err => console.log({ err }));
    };

    render() {
        console.log('side nav team props', this.props.userTeams)
        return (
            <div className='sidenav'>
                <div>
                    <h3>{this.props.currentUser?.firstName}</h3>
                    <button onClick={this.logoutAndLiftUserState}> Logout </button>
                </div>
                <h3>My Teams</h3>
                    <ul>
                        {
                            this.props.userTeams?.map(team =>
                            <>
                            <li key={team._id}>{team.name}</li>
                            <ul>
                                {
                                    team.projects.map(project => 
                                    <li key={project._id}>{project.name}</li>)
                                }
                            </ul>
                            </>
                            )
                        }
                    </ul>
                <h3>My Tasks</h3>
                <ul>
                        {
                            this.props.userTasks?.map(task =>
                            <li key={task._id}>{task.title}</li>)
                        }
                    </ul>
            </div>
        )
    }
}
