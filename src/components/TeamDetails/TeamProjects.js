import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PROJECT_SERVICE from '../../services/ProjectService';
import TEAM_SERVICE from '../../services/TeamService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default class TeamProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            newProject: false
        }
    }

    deleteProject = (projectId) => {
        PROJECT_SERVICE
            .deleteProject(projectId)
            .then(() => {
                TEAM_SERVICE
                    .getUserTeams()
                    .then(responseFromServer => {
                        const { teams } = responseFromServer.data;
                        this.props.updateUserTeams(teams);
                    })
                    .catch(err => console.log({ err }));
            })
            .catch(err => console.log({ err }));
    }

    toggleForm = () => {
        const {newProject} = this.state;
        this.setState({ newProject: !newProject});
        this.setState({
            name: '',
            description: '',
        })
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = () => {
        const { name, description } = this.state;
        const teamId = this.props.team._id;

        PROJECT_SERVICE
        .createProject({ name, description, team: teamId })
        .then(projectFromServer => {
            console.log({ projectFromServer });

            TEAM_SERVICE
            .getUserTeams()
            .then(responseFromServer => {
                const { teams } = responseFromServer.data;
                this.props.updateUserTeams(teams);
                this.setState({ newProject: false});
            })
            .catch(err => console.log({ err }));
        })
        .catch(err => console.log({ err }));
    }

    render() {
        return (
            <div className='team-projects'>
                <table>
                    <thead>
                        <tr>
                            <th>Project name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.projects?.map(project =>
                            <tr key={project._id}>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>
                                    <FontAwesomeIcon icon={faEdit} />
                                    <span> </span>
                                    <Link to={`/project/${project._id}`}><FontAwesomeIcon icon={faEye} /></Link>
                                    <span> </span>
                                    <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.deleteProject(project._id)} />
                                </td>
                            </tr>
                            )
                        }                        
                        {
                            this.state.newProject &&
                            <tr>
                                <td >
                                    <input 
                                    name='name'
                                    placeholder='project name'
                                    value={this.state.name}
                                    onChange={this.handleChange} />
                                </td>
                                <td>
                                <input 
                                    name='description'
                                    placeholder='project description'
                                    value={this.state.description}
                                    onChange={this.handleChange} />
                                </td>
                                <td>
                                    <button onClick={this.toggleForm}>cancel</button>
                                    <button onClick={this.handleFormSubmit}>create</button>
                                </td>
                            </tr>
                        }
                        <tr className='new-project' onClick={this.toggleForm}>
                            <td><FontAwesomeIcon icon={faPlusCircle} /></td>
                            <td>Add a new Project</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>                
            </div>
        )
    }
}
