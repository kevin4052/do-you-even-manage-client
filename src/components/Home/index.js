import React, { Component } from 'react';
import Navbar from '../Navbar';
import SideNav from '../SideNav';

import TEAM_SERVICE from '../../services/TeamService';
import PROJECT_SERVICE from '../../services/ProjectService';
import TASK_SERVICE from '../../services/TaskService';

export default class Home extends Component {
    state = {
        userTeams: [],
        userProjects: [],
        userTasks: []
    }

    componentDidMount = async () => {
        

        await TEAM_SERVICE
            .getUserTeams()
            .then(async responseFromServer => {
                // const { userTeams } = this.state;
                const { teams } = responseFromServer.data;
                // console.log({teams});
                // await this.setState({ userTeams: userTeams.concat(teams) });
                // const teamIDs = teams.map(team => team._id);
                // console.log({teamIDs})

                this.props.updateUserTeams(teams)

                // teamIDs.forEach(async teamID => {
                //     await PROJECT_SERVICE
                //     .getTeamProjects(teamID)
                //     .then(async responseFromServer => {
                //         const { userProjects } = this.state;
                //         const { projects } = responseFromServer.data;
                //         // console.log({ projects });
                //         await this.setState({ userProjects: userProjects.concat(projects) })
                //     })
                //     .catch(err => console.log({ err }));
                // })
                
            })
            .catch(err => console.log({ err }));

        await TASK_SERVICE
            .getAllUserTasks()
            .then(async responseFromServer => {
                const { userTasks } = this.state;
                const { tasks } = responseFromServer.data;
                await this.setState({ userTasks: userTasks.concat(tasks) })
            })
            .catch(err => console.log({ err }));


        console.log('this.state', this.state)

    }

    // updateUser = (user) => {
    //     this.props.onUserChange(user);
    // }

    render() {
        return (
            <div className='flex-row'>
                {/* <SideNav 
                    currentUser={this.props.currentUser}
                    userTeams={this.state.userTeams}
                    userProjects={this.state.userProjects}
                    userTasks={this.state.userTasks}
                    /> */}
                <div className='main-panel'>
                    {/* <Navbar currentUser={this.props.currentUser} onUserChange={this.updateUser} /> */}
                    <div>
                       <h2>Home page</h2>
                        {
                            this.props.currentUser && <h4>Welcome {this.props.currentUser?.firstname}</h4>
                        } 
                    </div>
                </div>
            </div>
        )
    }
}
