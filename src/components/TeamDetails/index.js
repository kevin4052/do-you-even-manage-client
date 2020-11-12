import React, { Component } from 'react'
import AUTH_SERVICE from '../../services/AuthService'
import TEAM_SERVICE from '../../services/TeamService'
import ProjectForm from '../ProjectForm';
import TeamProjects from './TeamProjects';

export default class TeamDetails extends Component {
    state = {
        team: null
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
            })
            .catch(err => console.log({ err }));
    }

    componentDidUpdate = () => {
        const { teamId } = this.props.match.params;
        const { team } = this.state;
        if (teamId !== team._id) this.componentDidMount();
    }

    showProjectModal = (event) => {
        const modalClassList = event.target.parentNode.parentNode.childNodes[2].classList;
        modalClassList.contains('display')
        ? modalClassList.remove('display')
        : modalClassList.add('display')
    }

    updateUserTeams = (teams) => {
        this.props.updateUserTeams(teams);
        this.componentDidMount();
    }

    render() {
        return (
            <div className='main-panel general-padding'>
                {
                    this.state.team ?
                    <h1>{this.state.team?.name}</h1> :
                    <p>Loading...</p>
                }

                <TeamProjects updateUserTeams={this.updateUserTeams} showProjectModal={this.showProjectModal} projects={this.state.team?.projects}/>          
                <ProjectForm updateUserTeams={this.updateUserTeams} teamId={this.state.team?._id}/>          
            </div>
        )
    }
}
