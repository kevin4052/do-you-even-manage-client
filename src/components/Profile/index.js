import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';

export default class Profile extends Component {

    componentDidMount = () => {
        AUTH_SERVICE
        .getAuthenticatedUser()
        .then(responseFromServer => {
            const { user } = responseFromServer.data;
            this.props.onUserChange(user);
        })
        .catch(err => console.log({ err }));
    }

    getTeamMembers = (teams) => {
        const allMembers = [...teams].map(team => team.members).flat();
        const uniqueMembers = {};
        allMembers.forEach(member => {
            if (uniqueMembers[member._id] === undefined) uniqueMembers[member._id] = member;
        })
        return Object.values(uniqueMembers).filter(member => member._id !== this.props.currentUser._id);
    }

    render() {
        const { firstName, lastName, email, profileImg } = this.props.currentUser;
        const teams = this.props.userTeams;

        return (
            <div className='main-panel'>
                <div className='profile-card'>
                    <img src={profileImg} alt='user-img' />
                    <div className='profile-card-info'>
                        <div className='user-info'>
                            <h3>{firstName} {lastName}</h3>
                            <p>{email}</p>
                        </div>
                        <div className='user-stats'>
                            <div>
                                <h4>{teams.length}</h4>
                                <h3>TEAMS</h3>
                            </div>
                            <div>
                                <h4>{teams.length}</h4>
                                <h3>TASKS</h3>
                            </div>
                        </div>
                    </div>
                    {/* {
                        teams?.map(team => <p key={`profile${team._id}`}>{team.name}</p>)
                    }
                    <p>Team members: 
                        {
                            this.getTeamMembers(teams).map(member => <span key={`profile${member._id}`}> {member.firstName} </span>)
                        }
                    </p> */}
                </div>
            </div>
        )
    }
}
