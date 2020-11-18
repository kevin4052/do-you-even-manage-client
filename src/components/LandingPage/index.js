import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Signup from '../Authentication/Signup';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: false
        }
    }

    updateUser = (user) => {
        this.props.onUserChange(user);
    }

    displayLoginModal = (event) => {}

    displaySignupModal = () => {
        const { signup } = this.state;
        this.setState({ signup: !signup });
    }

    render() {
        return (
            <div className='landing'>
                <div className='landing-content'>
                    <div className='landing-nav'>
                        <div>
                            <p><b>do you even manage</b></p>
                        </div>
                        <div className='landing-nav-auth'>
                            <Link to='/login'>
                                <p className='login-btn' onClick={this.displayLoginModal}>Login</p>
                            </Link>                            
                            <button onClick={this.displaySignupModal}>Get Started</button>
                        </div>                        
                    </div>
                    {
                        this.state.signup
                        ?<Signup onUserChange={this.updateUser}/>
                        :<div>
                            <h2>Project Management Tools</h2>
                            <p>to help you stay on track</p>
                            <div>
                                <button onClick={this.displaySignupModal}>Get Started</button>
                            </div>
                        </div>                        
                    }                    
                    <div>
                        <img src='https://www.ntaskmanager.com/wp-content/uploads/2019/07/3.png' alt=''/>
                    </div>
                </div>
            </div>
        )
    }
}
