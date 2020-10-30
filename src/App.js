import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Authentication/Signup';


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
          <Navbar />
          <Switch>
            <Route 
              exact path='/' 
              render={props => <Home {...props} currentUser={this.state.currentUser}/>} />
            <Route 
              exact path='/signup' 
              render={props => <Signup {...props} currentUser={this.state.currentUser} onUserChange={this.updateUser} />}/>
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
