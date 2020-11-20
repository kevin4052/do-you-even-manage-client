import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AUTH_SERVICE from './services/AuthService';
import Home from './components/Home';
import Signup from './components/Authentication/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Login from './components/Authentication/Login';
import Landing from './components/LandingPage';
import SideNav from './components/SideNav';
import ProjectDetails from './components/ProjectDetails';
import MyTasks from './components/MyTasks';
import TeamDetails from './components/TeamDetails';


class App extends Component {
  constructor(props) {
    super(props);
    this.state ={
      currentUser: null,
      userTeams: [],
      userTasks: [],
      currentTeam: null,
      currentTeamProjects: null,
      currentProject: null,
      currentProjectTasks: null,
      userLoading: false,
    }
  }

  componentDidMount = () => {
    this.getCurrentUser()
  }

  getCurrentUser = () => {
    AUTH_SERVICE
      .getAuthenticatedUser()
      .then(responseFromServer => {
        const { user } = responseFromServer.data;
        // console.log({user});
        this.setState({ currentUser: user });
      })
      .catch(err => {
        // console.log('auth error');
        this.setState({ currentUser: null });
      });
  }

  updateUser = (user) => {
    // console.log('app.js update user');
    this.setState({ 
      currentUser: user
    });
  }

  updateUserTeams = (teams) => {
    this.setState({ userTeams: teams })
  }

  updateCurrentProject = (project) => {
    this.setState({ currentProject: project })
  }

  updateUserTasks = (tasks) => {
    this.setState({ userTasks: tasks })
  }

  render() {
    // console.log({ state: this.state.currentUser });
    return (
      <div className="App">
        <BrowserRouter>
          {
            this.state.currentUser &&
            <SideNav 
                    currentUser={this.state.currentUser}
                    userTeams={this.state.userTeams}
                    userProjects={this.state.userProjects}
                    userTasks={this.state.userTasks}
                    onUserChange={this.updateUser}
                    updateUserTeams={this.updateUserTeams}
                    updateUserTasks={this.updateUserTasks}
                    />
          }

          <Switch>
            <Route 
              exact path='/' 
              render={props => 
              <Landing {...props} 
                currentUser={this.state.currentUser} 
                onUserChange={this.updateUser}/>} 
            />
            <Route 
              exact path='/signup' 
              render={props => 
              <Signup {...props} 
                currentUser={this.state.currentUser} 
                onUserChange={this.updateUser} />}
            />
            <Route 
              exact path='/login' 
              render={props => 
              <Login {...props} 
                currentUser={this.state.currentUser} 
                onUserChange={this.updateUser} />}
            />

            {!this.state.currentUser 
            ?<div>Loading...</div>
            :<ProtectedRoute
              path='/project/:projectId'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props => 
                <ProjectDetails {...props} 
                  currentUser={this.state.currentUser} 
                  onUserChange={this.updateUser}
                  updateUserTeams={this.updateUserTeams}
                  updateCurrentProject={this.updateCurrentProject}
                  currentProject={this.state.currentProject}
                  />}
            />}

            {!this.state.currentUser 
            ?<div>Loading...</div>
            :<ProtectedRoute
              path='/my-tasks'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props => 
                <MyTasks {...props} 
                  currentUser={this.state.currentUser} 
                  onUserChange={this.updateUser}
                  />}/>
            }
            
            {!this.state.currentUser 
            ?<div>Loading...</div>
            :<ProtectedRoute
              path='/team/:teamId'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props =>
                    <TeamDetails {...props} 
                      currentUser={this.state.currentUser}
                      onUserChange={this.updateUser}
                      updateUserTeams={this.updateUserTeams}
                      />}/>
            }

            {!this.state.currentUser 
            ?<div>Loading...</div>
            :<ProtectedRoute
              path='/profile'
              authorized={this.state.currentUser}
              redirect={'/login'}
              render={props => 
                <Profile {...props} 
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser} 
                  updateCurrentTeam={this.updateCurrentTeam}
                  userTeams={this.state.userTeams}
                />}
            />}

            {!this.state.currentUser 
            ?<div>Loading...</div>
            :<ProtectedRoute
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
