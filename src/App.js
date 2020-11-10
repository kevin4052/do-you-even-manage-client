import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Authentication/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Login from './components/Authentication/Login';

import AUTH_SERVICE from './services/AuthService';
import Landing from './components/LandingPage';
import SideNav from './components/SideNav';
import Navbar from './components/Navbar';
import ProjectDetails from './components/ProjectDetails';
import MyTasks from './components/MyTasks';
import TeamDetails from './components/TeamDetails';
// import TEAM_SERVICE from './services/TeamService';
// import TASK_SERVICE from './services/TaskService';
// import TEAM_SERVICE from './services/TeamService';


class App extends Component {
  state ={
    currentUser: null,
    userTeams: [],
    userTasks: [],
    currentTeam: null,
    currentTeamProjects: null,
    currentProject: null,
    currentProjectTasks: null,
    userLoading: true,
  }

  componentDidMount = async () => {
    await AUTH_SERVICE
      .getAuthenticatedUser()
      .then(responseFromServer => {
        const { user } = responseFromServer.data;
        this.setState({ currentUser: user, userLoading: false });
      })
      .catch(err => console.log({ err }));
  }

  updateUser = (user) => {
    this.setState({ currentUser: user});
  }

  updateUserTeams = (teams) => {
    this.setState({ userTeams: teams})
  }

  updateCurrentProject = (project) => {
    this.setState({ currentProject: project})
  }

  updateUserTasks = (tasks) => {
    this.setState({ userTasks: tasks})
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>

          {
            this.state.currentUser
            ? <SideNav 
                    currentUser={this.state.currentUser}
                    userTeams={this.state.userTeams}
                    userProjects={this.state.userProjects}
                    userTasks={this.state.userTasks}
                    onUserChange={this.updateUser}
                    updateUserTeams={this.updateUserTeams}
                    updateUserTasks={this.updateUserTasks}
                    />
            : <Navbar currentUser={this.props.currentUser} onUserChange={this.updateUser} />
          }

          <Switch>
            <Route 
              exact path='/' 
              render={props => <Landing {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser}/>} 
            />
            <Route 
              exact path='/signup' 
              render={props => <Signup {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser} />}
            />
            <Route 
              exact path='/login' 
              render={props => <Login {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser} />}
            />

            <Route 
              exact path={'/project/:projectId'}
              render={props => 
                <ProjectDetails {...props} 
                  currentUser={this.state.currentUser} 
                  onUserChange={this.updateUser}
                  updateCurrentProject={this.updateCurrentProject}
                  currentProject={this.state.currentProject}
                  />}
            />
            
            <Route 
              exact path={'/my-tasks'}
              render={props => 
                <MyTasks {...props} 
                  currentUser={this.state.currentUser} 
                  onUserChange={this.updateUser}
                  />}
            />

            <Route 
              exact path={'/team/:teamId'}
              render={props => 
                <TeamDetails {...props} 
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                  />}
            />

            {this.state.userLoading ?
            <div>Loading...</div>
            :
            <ProtectedRoute
              path='/profile'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props => 
                <Profile {...props} 
                  currentUser={this.state.currentUser}
                  currentTeam={this.state.currentTeam}
                  currentProject={this.state.currentProject}
                  onUserChange={this.updateUser} 
                  updateCurrentTeam={this.updateCurrentTeam}
                  updateCurrentProject={this.updateCurrentProject}
                />}
            />}

            {this.state.userLoading ?
            <div>Loading...</div>
            :
            <ProtectedRoute
              path='/home'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props => 
                <Home {...props} 
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser} 
                  currentTeam={this.state.currentTeam}
                  currentProject={this.state.currentProject}
                  updateUserTeams={this.updateUserTeams}
                />}
            />}
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
