import React, { Component } from 'react';
import AUTH_SERVICE from '../../../services/AuthService';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
        message: null
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmission = event => {
        event.preventDefault();
        const { email, password } = this.state;

        AUTH_SERVICE
            .login({ email, password })
            .then(responseFromServer => {
                const { user } = responseFromServer.data;
                // lift user up to App.js
                this.props.onUserChange(user);
                this.props.history.push('/'); // redirect back to the home page
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    return this.setState({ message: err.response.data.message });
                }
            });
    }

    render() {
        return (
            <section>
                <form onSubmit={this.handleFormSubmission}>
                    <label>
                        Email:
                        <input
                            name='email'
                            type='email'
                            placeholder='john@ironhack.com'
                            value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            name='password'
                            type='password'
                            placeholder='**********'
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <button> Login </button>
                </form>
                {this.state.message && <div> {this.state.message} </div>}
            </section>
        )
    }
}
