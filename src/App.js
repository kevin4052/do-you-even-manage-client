import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Authentication/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Login from './components/Authentication/Login';

import AUTH_SERVICE from './services/AuthService';
// import TASK_SERVICE from './services/TaskService';
// import TEAM_SERVICE from './services/TeamService';


class App extends Component {
  state ={
    currentUser: null,
    currentTeam: null,
    currentTeamProjects: null,
    currentProject: null,
    currentProjectTasks: null,
    userTasks: [],
    userTeams: []
  }

  componentDidMount = () => {
    AUTH_SERVICE
      .getAuthenticatedUser()
      .then(responseFromServer => {
        const { user } = responseFromServer.data;
        this.setState({ currentUser: user });
      })
      .catch(err => console.log({ err }));
  }

  updateUser = (user) => {
    this.setState({ currentUser: user});
  }

  updateCurrentTeam = (team) => {
    console.log("app.js update current team", {team})
    this.setState({ 
      currentTeam: team,
      currentProject: null,
     });
  }

  updateCurrentProject = (project) => {
    console.log("app.js update current project", {project})
    this.setState({ currentProject: project });
    // this.getProjectTasks(project._id);
  }

  // getProjectTasks = (projectId) => {
  //   TASK_SERVICE
  //     .getProjectTasks(projectId)
  //     .then(tasksFromServer => {
  //       const { tasks } = tasksFromServer.data;
  //     })
  //     .catch(err => console.log({ err }));
  // }

  render() {
    return (
      <div className="App">
        <BrowserRouter>

          <Navbar currentUser={this.state.currentUser} onUserChange={this.updateUser} />

          <Switch>
            <Route 
              exact path='/' 
              render={props => <Home {...props} currentUser={this.state.currentUser}/>} 
            />
            <Route 
              exact path='/signup' 
              render={props => <Signup {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser} />}
            />
            <Route 
              exact path='/login' 
              render={props => <Login {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser} />}
            />
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
            />
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
