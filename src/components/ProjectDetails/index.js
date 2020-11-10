import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';
import PROJECT_SERVICE from '../../services/ProjectService';

export default class ProjectDetails extends Component {
    state = {
        project: null
    }

    componentDidMount = () => {
        const { projectId } = this.props.match.params;
        console.log({ projectId })

        Promise
            .all([AUTH_SERVICE.getAuthenticatedUser(), PROJECT_SERVICE.getOneProject(projectId)])
            .then(async responseFromServer => {
                const { user } = responseFromServer[0].data;
                const { project } = responseFromServer[1].data;

                console.log({ project });

                this.props.onUserChange(user);
                // this.props.updateCurrentProject(project);
                await this.setState({ project });
            })
            .catch(err => console.log({ err }));
    }
    render() {
        // console.log(this.props.currentProject);
        return (
            <div className='flex-row'>
                <div className='main-panel'>
                    <h3>Project name: {this.state.project?.name}</h3>
                    <ul>
                        <li>description: {this.state.project?.description}</li>
                        <li>Tasks:
                            <ul>
                                {
                                    this.state.project?.tasks.map(task => 
                                    <li key={task._id}>{task.title}</li>)
                                }
                            </ul>
                        </li>
                    </ul>
                </div>                
            </div>
        )
    }
}
