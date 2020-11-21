import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
import MemberCard from '../MemberCard';
import EditForm from '../TeamForm/EditForm';
import TeamProjects from './TeamProjects';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default class TeamDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: null,
            editForm: false
        }
    }

    componentDidMount = () => {
        const { teamId } = this.props.match.params;
        Promise
        .all([AUTH_SERVICE.getAuthenticatedUser(), TEAM_SERVICE.getOneTeam(teamId)])
        .then(responseFromServer => {
            const { user } = responseFromServer[0].data;
            const { team } = responseFromServer[1].data;
            this.setState({ team });
            this.props.onUserChange(user);
            // console.log({ team })
        })
        .catch(err => console.log({ err }));
    }

    componentDidUpdate = () => {
        const { teamId } = this.props.match.params;
        const { team } = this.state;
        if (teamId !== team?._id) this.componentDidMount();
    }

    updateUserTeams = (teams) => {
        this.props.updateUserTeams(teams);
        this.componentDidMount();
    }

    TeamEditForm = (event) => {
        console.log('edit team form')
        const { editForm } = this.state;
        this.setState({ editForm: !editForm });
        // // console.log(event.target.parentNode.parentNode.parentNode.childNodes)
        // const modalClassList = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[2].classList;

        // console.log(modalClassList);
        // modalClassList.contains('display')
        // ? modalClassList.remove('display')
        // : modalClassList.add('display');
    }

    deleteTeam = () => {
        TEAM_SERVICE
        .deleteTeam(this.state.team._id)
        .then(() => {
            TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                this.props.updateUserTeams(teams);
                this.props.history.push('/home');
            })
            .catch(err => console.log({ err }));
        })
        .catch(err => console.log({ err }));
    }

    updateTeamDetails = (team) => {
        this.setState({ team });
    }

    render() {
        // console.log({state: this.state});
        return (
            <div className='main-panel'>
                {
                    this.state.team 
                    ?<div className='team-title'>
                        <h1>{this.state.team?.name}</h1>
                        <div className='team-title-btn'>
                            <FontAwesomeIcon style={{background: 'white'}} icon={faEdit} onClick={() => this.TeamEditForm()} />
                            <FontAwesomeIcon style={{background: 'white'}} icon={faTimesCircle} onClick={this.deleteTeam} />
                        </div>
                    </div>                    
                    :<p>Loading...</p>                    
                }
                <div className='team-content'>
                    <MemberCard members={this.state.team?.members}/>  
                    {this.state.team && 
                        <TeamProjects 
                            updateUserTeams={this.updateUserTeams}
                            team={this.state.team}
                            projects={this.state.team.projects}/>
                    }
                </div>
                {this.state.editForm &&
                    <EditForm 
                        team={this.state.team}
                        currentUser={this.props?.currentUser}
                        updateUserTeams={this.updateUserTeams}
                        updateTeamDetails={this.updateTeamDetails}
                        TeamEditForm={this.TeamEditForm}
                        />
                }
            </div>
        )
    }
}
