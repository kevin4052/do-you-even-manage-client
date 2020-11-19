import React, { Component } from 'react';
import AUTH_SERVICE from '../../../services/AuthService';
import { Link } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            message: null
        }
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmission = event => {
        event.preventDefault();
        const { email, password } = this.state;
        console.log('logging in');
        AUTH_SERVICE
            .login({ email, password })
            .then(responseFromServer => {
                const { user } = responseFromServer.data;
                console.log({loggedInUser: user});
                // lift user up to App.js
                this.props.onUserChange(user);
                this.props.history.push('/home'); // redirect back to the home page
            })
            .catch(err => {
                console.log("error logging in")
                if (err.response && err.response.data) {
                    return this.setState({ message: err.response.data.message });
                }
            });
    }

    render() {
        return (
            <div className='landing'>
                <div className='landing-content'>
                    <div className='landing-nav'>
                        <div>
                            <Link to='/'>
                                <p><b>do you even manage</b></p>
                            </Link>
                        </div>                       
                    </div>
                    <section className='center-content modal display'>
                        <form className='form' onSubmit={this.handleFormSubmission}>
                            <h3>Login</h3>
                            <input
                                name='email'
                                type='email'
                                placeholder='Email address'
                                value={this.state.email}
                                onChange={this.handleInputChange}
                            />
                            <br/>
                            <input
                                name='password'
                                type='password'
                                placeholder='Password'
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />
                            <br/>
                            <button> Login </button>
                        </form>
                        {this.state.message && <div> {this.state.message} </div>}
                    </section>
                </div>
            </div>
        )
    }
}
