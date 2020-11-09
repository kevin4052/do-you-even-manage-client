import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
import TASK_SERVICE from '../../services/TaskService';

export default class SideNav extends Component {
    state = {

    }

    componentDidMount = () => {
        Promise.all([
            AUTH_SERVICE.getAuthenticatedUser(), 
            TEAM_SERVICE.getUserTeams(), 
            TASK_SERVICE.getAllUserTasks()])
            .then(responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { teams } = responseFromServer[1].data;
                const { tasks } = responseFromServer[2].data;

                this.props.onUserChange(user);
                this.props.updateUserTeams(teams);
                this.props.updateUserTasks(tasks);
            })
            .catch(err => console.log({ err }))
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
                <div className="logo">
                    <Link to='/home'>
                        <img src='/logo192.png' alt='app logo'/>
                    </Link>
                    <Link to='/home'>APP LOGO</Link>
                </div>
                <div className='sidenav-wrapper'>
                    <div className="user">
                        <div className='user-info'>
                            <img src={this.props.currentUser?.profileImg} alt='profile img'/>
                            <h3>{this.props.currentUser?.firstName}</h3>
                        </div>
                        <button onClick={this.logoutAndLiftUserState}> Logout </button>
                    </div>
                    <div className="nav">
                        <h3>My Teams</h3>
                            <ul className='collapse'>
                                {
                                    this.props.userTeams?.map(team =>
                                    <>
                                        <li key={team._id}>{team.name}</li>
                                            <ul className='collapse'>
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
                    </div>
                </div>
            </div>
        )
    }
}
