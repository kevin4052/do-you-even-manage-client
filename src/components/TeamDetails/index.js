import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
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
        const nodeList = event.target.parentNode.parentNode.childNodes;
        const modalClassList = [...nodeList].filter(node => node.classList.contains('modal'))[0].classList;
        // console.log({ modalClassList });
        modalClassList.contains('display')
        ? modalClassList.remove('display')
        : modalClassList.add('display')
    }

    updateUserTeams = (teams) => {
        this.props.updateUserTeams(teams);
        this.componentDidMount();
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

    render() {
        return (
            <div className='main-panel general-padding'>
                {
                    this.state.team ?
                    <h1>{this.state.team?.name}</h1> :
                    <p>Loading...</p>
                }
                <button onClick={this.deleteTeam}>Delete Team</button>

                <TeamProjects 
                    updateUserTeams={this.updateUserTeams}
                    showProjectModal={this.showProjectModal}
                    projects={this.state.team?.projects}/>
                <ProjectForm 
                    updateUserTeams={this.updateUserTeams} 
                    teamId={this.state.team?._id}/>
            </div>
        )
    }
}
