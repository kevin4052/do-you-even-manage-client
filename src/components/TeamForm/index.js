import React, { Component } from 'react';
import TEAM_SERVICE from '../../services/TeamService';

export default class TeamForm extends Component {
    state = {
        name: '',
        owner: this.props.currentUser._id,
        members: []
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { name, owner, members } = this.state;

        members.push(this.props.currentUser._id);

        TEAM_SERVICE
            .createTeam({ name, owner, members })
            .then(teamFromServer => {
                const { team } = teamFromServer.data;
                console.log({ team });
                this.props.newTeam(team);
                this.setState({ 
                    name: '',
                    members: []
                });
            })
            .catch(err => console.log({ err }));

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Team name:
                        <input 
                            name='name' 
                            type='text'
                            placeholder='team name'
                            value={this.state.name}
                            onChange={this.handleInputChange}/>
                    </label>
                    <button> Create a Team </button>
                </form>
            </div>
        )
    }
}
