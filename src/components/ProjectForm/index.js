import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import PROJECT_SERVICE from '../../services/ProjectService';
import TEAM_SERVICE from '../../services/TeamService';


export default class ProjectForm extends Component {
    state = {
        name: '',
        description: '',
        team: null
    }

    componentDidMount = () => {
        AUTH_SERVICE
            .getAllUsers()
            .then(responseFromServer => {
                const { users } = responseFromServer.data;
                this.setState({ usersList: users});
            })
            .catch(err => console.log({ err }));
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        const { name, description } = this.state;
        const modalClasslist = event.target.parentNode.parentNode.classList;

        // console.log({submit: modalClasslist})

        PROJECT_SERVICE
            .createProject({ name, description, team: this.props.teamId })
            .then(projectFromServer => {
                // const { project } = projectFromServer.data;
                this.setState({ 
                    name: '',
                    description: ''
                });

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

    cancelForm = (event) => {
        const modalClasslist = event.target.parentNode.parentNode.classList;
        const selector = event.target.parentNode.childNodes[1];

        // console.log({ modalClasslist})

        modalClasslist.remove('display');
        selector.selectedIndex = 0;
        
        this.setState({
            name: '',
            members: []
        })
    }

    render() {
        return (
            <div className='modal'>
                <div className='modal-content'>
                    <label>
                        {/* Project name: */}
                        <input 
                            name='name' 
                            type='text'
                            placeholder='project name'
                            value={this.state.name}
                            onChange={this.handleInputChange}/>
                    </label>
                    <label>
                        {/* Project description: */}
                        <input 
                            name='description' 
                            type='text'
                            placeholder='project description'
                            value={this.state.description}
                            onChange={this.handleInputChange}/>
                    </label>
                    <button onClick={this.cancelForm}> Cancel </button>
                    <button onClick={this.handleFormSubmit}> Create a Project </button>
                </div>
            </div>
        )
    }
}
