import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
import TASK_SERVICE from '../../services/TaskService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

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
    }

    itemIsActive = (event) => {
        let listClassName = event.target.className;
        // let ulClassName = event.target.parentElement.children[1].className;

        console.log( {listClassName} );
        // console.log( {ulClassName} );

        !listClassName.split(' ').includes('active')
        ? listClassName += ' active'
        : listClassName = listClassName.split(' ').filter(name => name !== 'active').join(' ');

        event.target.className = listClassName;
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
                        <div className='photo'>
                            <img src={this.props.currentUser?.profileImg} alt='profile img'/>
                        </div>
                        <div className='user-info'>
                            <div>
                                <span>{this.props.currentUser?.firstName}</span>
                                <div className='caret'>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                            <div className='collapse show'>
                                <ul>
                                    <li>
                                        <button onClick={this.logoutAndLiftUserState}> Logout </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                    </div>

                    <ul className="nav">
                        <li className='' onClick={this.itemIsActive}>
                            <div className='list-info'  >
                                <div className='icon'>
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                                <div>My Teams</div>
                                <div className='caret'>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                            <ul className='collapse'>
                                {
                                    this.props.userTeams?.map(team =>
                                    <>
                                        <li key={team._id} className=''>{team.name}
                                            <ul className='collapse'>
                                                {
                                                    team.projects.map(project => 
                                                    <li key={project._id}>{project.name}</li>)
                                                }
                                            </ul>
                                        </li>
                                    </>
                                    )
                                }
                            </ul>
                        </li>
                        <li className='' onClick={this.itemIsActive} >
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
            </div>
        )
    }
}
