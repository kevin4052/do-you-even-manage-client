import React, { Component } from 'react';
import PROJECT_SERVICE from '../../services/ProjectService';


export default class index extends Component {
    state = {
        name: '',
        description: '',
        team: this.props.currentTeam._id
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { name, description, team } = this.state;

        PROJECT_SERVICE
            .createProject({ name, description, team })
            .then(projectFromServer => {
                const { project } = projectFromServer.data;
                console.log({ project });
                this.props.newProject(project);
                this.setState({ 
                    name: '',
                    description: ''
                });
            })
            .catch(err => console.log({ err }));

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Project name:
                        <input 
                            name='name' 
                            type='text'
                            placeholder='project name'
                            value={this.state.name}
                            onChange={this.handleInputChange}/>
                    </label>
                    <label>
                        Project description:
                        <input 
                            name='description' 
                            type='text'
                            placeholder='project description'
                            value={this.state.description}
                            onChange={this.handleInputChange}/>
                    </label>
                    <button> Create a Project </button>
                </form>
            </div>
        )
    }
}
