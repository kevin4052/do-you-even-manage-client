import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
import TASK_SERVICE from '../../services/TaskService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import TeamForm from '../TeamForm';

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
            .then(() => {
                this.props.onUserChange(null);
                this.props.history.push('/')
            })
            .catch(err => console.log({ err }));
    }

    itemIsActive = (event) => {
        const listClassName = event.target.parentNode.children[2].classList;

        console.log({event: event.target.parentNode.children[2].classList})

        if(listClassName.contains('show')) {
            listClassName.remove('show');
        } else {
            listClassName.add('show')
        }
    }

    createTeamForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[2].classList;
        console.log({ modalClasslist });

        modalClasslist.contains('display')
        ? modalClasslist.remove('display')
        : modalClasslist.add('display')

    }

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
                            <button className='onClickBtn' onClick={this.itemIsActive}></button>
                            <div className='user-info-block'>
                                <div className='photo'>
                                    <img src={this.props.currentUser?.profileImg} alt='profile img'/>
                                </div>
                                <span>{this.props.currentUser?.firstName}</span>
                                <div className='caret'>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                            <ul className='collapse'>
                                <li>
                                    <Link to={`/profile`}>
                                        <button className='onClickBtn'></button>
                                    </Link>
                                    <div className='user-options'>
                                        <FontAwesomeIcon icon={faUser} />
                                        <div>PROFILE</div>
                                    </div>                                        
                                </li>
                                <li>
                                    <button className='onClickBtn' onClick={this.logoutAndLiftUserState}></button>
                                    <div className='user-options'>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        <div>LOGOUT</div>
                                    </div>
                                </li>
                            </ul>
                        </div>                        
                    </div>

                    <ul className="nav">
                        <li className=''>
                            <button className='onClickBtn' onClick={this.itemIsActive}></button>
                            <div className='list-info'  >
                                <div className='icon'>
                                    <FontAwesomeIcon icon={faTh} />
                                </div>
                                <div>My Teams</div>
                                <div className='caret'>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                            <ul className='collapse'>
                                <li>
                                    <button className='onClickBtn' onClick={this.createTeamForm}></button>
                                    <div>
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                        <div>Create a Team</div>
                                    </div>
                                </li>
                                {
                                    this.props.userTeams?.map(team =>
                                    <>
                                        <li key={team._id} className='teams'>
                                            <Link to={`/team/${team._id}`}>
                                                <button className='onClickBtn'></button>
                                            </Link>
                                            
                                            <div className='teams-info'>
                                                <FontAwesomeIcon icon={faTh} />
                                                <div>{team.name}</div>
                                            </div>
                                            <ul className='collapse'>
                                                {
                                                    team.projects.map(project => 
                                                    <Link to={`/project/${project._id}`}><li key={project._id}>{project.name}</li></Link>
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    </>
                                    )
                                }
                            </ul>
                        </li>
                        <li className=''>
                            <Link to='/my-tasks'><button className='onClickBtn'></button></Link>
                            <div className='list-info' >
                                <div className='icon'>
                                    <FontAwesomeIcon icon={faTasks} />
                                </div>
                                <div className='list-info-title'>My Tasks</div>
                                <div className='caret'>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <TeamForm 
                    currentUser={this.props.currentUser}
                    updateUserTeams={this.props.updateUserTeams}/>
            </div>
        )
    }
}
