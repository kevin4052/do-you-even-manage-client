import React, { Component } from 'react';
import AUTH_SERVICE from '../../../services/AuthService';
import './style.css';

export default class Signup extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profileImg: null,
        message: null
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmission = event => {
        event.preventDefault();
        const { firstName, lastName, email, password } = this.state;
        console.log({ firstName, lastName, email, password })

        AUTH_SERVICE
            .signup({ firstName, lastName, email, password })
            .then(responseFromServer => {
                const { user } = responseFromServer.data;
                // lift user up to App.js
                this.props.onUserChange(user);
                this.props.history.push('/home'); // redirect back to the home page
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    return this.setState({ message: err.response.data.message });
                }
            });
    }

    render() {
        return (
            <section className=' '>
                <form className='form' onSubmit={this.handleFormSubmission}>
                    <h3>Signup</h3>
                    
                    <input
                        name='firstName'
                        type='text'
                        placeholder='First name'
                        value={this.state.username}
                        onChange={this.handleInputChange}
                    />
                    <br/>
                    <input
                        name='lastName'
                        type='text'
                        placeholder='Last name'
                        value={this.state.username}
                        onChange={this.handleInputChange}
                    />
                    <br/>
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
                    <button> Signup </button>
                    {this.state.message && <div> {this.state.message} </div>}
                </form>
            </section>
        )
    }
}
