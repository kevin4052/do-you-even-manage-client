import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';
import MemberCard from '../MemberCard';
import ProjectForm from '../ProjectForm';
import EditForm from '../TeamForm/EditForm';
import TeamProjects from './TeamProjects';

export default class TeamDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: null
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

    showProjectModal = (event) => {
        const nodeList = event.target.parentNode.parentNode.childNodes;
        const modalClassList = [...nodeList].filter(node => node.classList.contains('modal'))[0].classList;
        // console.log({ modalClassList });
        modalClassList.contains('display')
        ? modalClassList.remove('display')
        : modalClassList.add('display')
    }

    showTeamEditForm = (event) => {
        console.log({ edit: event.target.parentNode.childNodes[5] })
        const modalClassList = event.target.parentNode.childNodes[5].classList;
        modalClassList.contains('display')
        ? modalClassList.remove('display')
        : modalClassList.add('display')

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
                    ?
                    <div>
                        <h1>{this.state.team?.name}</h1>
                        <div className='members'>
                            <MemberCard members={this.state.team.members}/>
                            
                        </div>
                    </div>
                    :
                    <p>Loading...</p>
                }
                <button onClick={this.showTeamEditForm}>Edit Team</button>
                <button onClick={this.deleteTeam}>Delete Team</button>

                {this.state.team && (
                    <>
                    <TeamProjects 
                        updateUserTeams={this.updateUserTeams}
                        showProjectModal={this.showProjectModal}
                        team={this.state.team}
                        projects={this.state.team.projects}/>
                    <ProjectForm 
                        updateUserTeams={this.updateUserTeams} 
                        teamId={this.state.team._id}/>
                    <EditForm 
                        team={this.state.team}
                        currentUser={this.props.currentUser}
                        updateUserTeams={this.updateUserTeams}
                        updateTeamDetails={this.updateTeamDetails}
                    />
                    </>
                    )}
            </div>
        )
    }
}
