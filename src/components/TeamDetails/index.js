import React, { Component } from 'react'
import AUTH_SERVICE from '../../services/AuthService'
import TEAM_SERVICE from '../../services/TeamService'

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

    render() {
        return (
            <div className='main-panel general-padding'>
                {
                    this.state.team ?
                    <h1>{this.state.team?.name}</h1> :
                    <p>Loading...</p>
                }
                
            </div>
        )
    }
}
