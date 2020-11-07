import React from 'react';
import { Link } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';
import './style.css';

const Navbar = props => {

    const logoutAndLiftUserState = () => {
        AUTH_SERVICE
            .logout()
            .then(() => props.onUserChange(null))
            .catch(err => console.log({ err }));
    };

    return (
        <nav>
            <div>
                {
                    props.currentUser
                    ? <Link to='/home'> APP NAME </Link>
                    : <Link to='/'> APP NAME </Link>
                }
                
                
            </div>
            {
                props.currentUser
                ? <div>
                    <Link to='/profile'> Profile </Link>
                    <button onClick={logoutAndLiftUserState}> Logout </button>
                </div>
                : <div>
                    <Link to='/signup'> Signup </Link>
                    <Link to='/login'> Login </Link>
                </div>

            }
        </nav>
    )

}

export default Navbar;
