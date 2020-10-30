import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Authentication/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Login from './components/Authentication/Login';


class App extends Component {
  state ={
    currentUser: null,
  }

  updateUser = (user) => {
    this.setState({ currentUser: user});
  }

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
              render={props => <Profile {...props} currentUser={this.state.currentUser} />}
            />
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
