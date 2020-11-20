import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import TEAM_SERVICE from '../../services/TeamService';

export default class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamId: '',
            name: '',
            members: null,
            projects: null,
            usersList: null
        }
    }

    componentDidMount = () => {
        const { _id, name, members, projects } = this.props?.team;
        console.log({props: this.props});
        AUTH_SERVICE
            .getAllUsers()
            .then(responseFromServer => {
                const { users } = responseFromServer.data;
                this.setState({ 
                    usersList: users,
                    teamId: _id,
                    name,
                    members,
                    projects

                });
            })
            .catch(err => console.log({ err }));
    }

    componentDidUpdate = () => {
        if (this.props.team._id !== this.state.teamId) {
            this.componentDidMount();
        }

    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        const { name, members, projects } = this.state;
        const memberIDs = members.map(member => member._id);
        const projectIDs = projects.map(projects => projects._id);
        const modalClasslist = event.target.parentNode.parentNode.classList;

        console.log(name, memberIDs);
        console.log({ modalClasslist })

        TEAM_SERVICE
            .updateTeam(this.state.teamId, { 
                name, 
                members: memberIDs.length === 0 ? this.props.currentUser._id : memberIDs, 
                projects: projectIDs 
            })
            .then(teamFromServer => {
                const { team } = teamFromServer.data;
                console.log({ newTeamData: team })

                TEAM_SERVICE
                    .getUserTeams()
                    .then(responseFromServer => {
                        const { teams } = responseFromServer.data;
                        this.props.updateUserTeams(teams);
                        modalClasslist.remove('display');
                    })
                    .catch(err => console.log({ err }));
            })
            .catch(err => console.log({ err }));

    }

    addMember = (event) => {
        const { usersList, members } = this.state;
        const selectedID = event.target.parentNode.childNodes[1].value;
        const selectedUser = usersList.filter(user => user._id === selectedID)[0];
        members.push(selectedUser);
        this.setState({ members });
    }

    removeMember = (event) => {
        let { members } = this.state;
        const memberToRemove = event.target.parentNode.attributes.member.nodeValue;
        members = members.filter(member => member._id !== memberToRemove);
        this.setState({ members });
        // const memberToRemove = event.target.parentNode.attributes.member.nodeValue
        // console.log({ members })
    }

    cancelForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const selector = event.target.parentNode.childNodes[1];
        modalClasslist.remove('display');
        selector.selectedIndex = 0;
    }

    render() {
        console.log({editState: this.state});
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
                                <div className='member-list' key={`edit${member._id}`} member={member._id}>
                                    <p>{member.firstName} {member.lastName}</p>
                                    <button onClick={this.removeMember}>X</button>
                                </div>)
                        }
                    </div>
                    
                    <button onClick={this.cancelForm}> Cancel </button>
                    <button onClick={this.handleFormSubmit}> Edit Team </button>
                </div>
            </div>
        )
    }
}
