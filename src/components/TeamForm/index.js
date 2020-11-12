import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';

export default class TeamForm extends Component {
    state = {
        name: '',
        owner: this.props.currentUser._id,
        members: [],
        usersList: null
    }

    componentDidMount = () => {
        AUTH_SERVICE
            .getAllUsers()
            .then(responseFromServer => {
                const { users } = responseFromServer.data;
                // const usersWithoutCurrentUser = users.filter(user => user._id !== this.props.currentUser._id);
                this.setState({ usersList: users});
            })
            .catch(err => console.log({ err }));
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        const { name, owner, members } = this.state;
        const memberIDs = members.map(member => member._id);
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const selector = event.target.parentNode.childNodes[1];

        TEAM_SERVICE
            .createTeam({ name, owner, members: memberIDs })
            .then(teamFromServer => {
                // const { team } = teamFromServer.data;
                this.setState({ 
                    name: '',
                    members: []
                });

                TEAM_SERVICE
                    .getUserTeams()
                    .then(responseFromServer => {
                        const { teams } = responseFromServer.data;
                        this.props.updateUserTeams(teams);
                        modalClasslist.remove('display');
                        selector.selectedIndex = 0;
                    })
                    .catch(err => console.log({ err }));
            })
            .catch(err => console.log({ err }));

    }

    addMember = (event) => {
        // console.log({addMember: event.target.parentNode.childNodes[1]})
        const { usersList, members } = this.state;
        const selectedID = event.target.parentNode.childNodes[1].value;
        const selectedUser = usersList.filter(user => user._id === selectedID)[0];
        members.push(selectedUser);
        this.setState({ members });
    }

    cancelForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const selector = event.target.parentNode.childNodes[1];

        modalClasslist.remove('display');
        selector.selectedIndex = 0;
        
        this.setState({
            name: '',
            members: []
        })
    }

    render() {
        // console.log({users: this.state.usersList})
        // console.log({members: this.state.members})
        return (
            <div className='modal'>
                <div className='modal-content'>
                    <input 
                        name='name' 
                        type='text'
                        placeholder='team name'
                        value={this.state.name}
                        onChange={this.handleInputChange}/>

                    <div>
                        <label htmlFor="members">Select members:</label>
                        <select name="members" id="members">
                            <option value={null}></option>
                            {
                                this.state.usersList?.map(user => 
                                <option key={`member${user._id}`} value={user._id} >{user.firstName} {user.lastName}</option>)
                            }
                        </select>
                        <button onClick={(user) => this.addMember(user)}>add</button>
                    </div>
                    <div>
                        {
                            this.state.members?.map(member => 
                                <div>
                                    <p>{member.firstName} {member.lastName}</p>
                                </div>)
                        }
                    </div>
                    
                    <button onClick={this.cancelForm}> Cancel </button>
                    <button onClick={this.handleFormSubmit}> Create a Team </button>
                </div>
            </div>
        )
    }
}
