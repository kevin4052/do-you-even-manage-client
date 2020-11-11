import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TeamProjects extends Component {

    showProjectModal = (event) => {
        const modal = event.target.parentNode.parentNode.childNodes[2].classList;
        console.log({ modalTest: modal})
        this.props.showProjectModal(event);
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
