import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PROJECT_SERVICE from '../../services/ProjectService';
import TEAM_SERVICE from '../../services/TeamService';

export default class TeamProjects extends Component {

    showProjectModal = (event) => {
        const modal = event.target.parentNode.parentNode.childNodes[2].classList;
        console.log({ modalTest: modal})
        this.props.showProjectModal(event);
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

    render() {
        return (
            <div className='team-projects'>
                <button onClick={this.showProjectModal}>Start a new Project</button>
                <table>
                    <thead>
                        <tr>
                            <th>Project name</th>
                            <th>number of tasks</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.projects?.map(project =>
                            <tr key={project._id}>
                                <td>{project.name}</td>
                                <td>{project.tasks.length}</td>
                                <td>
                                    <Link to={`/project/${project._id}`}><button>View</button></Link>
                                    <button onClick={() => this.deleteProject(project._id)}>Delete</button>
                                </td>
                            </tr>
                            )
                        }                        
                    </tbody>
                </table>                
            </div>
        )
    }
}
