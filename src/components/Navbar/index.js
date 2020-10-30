import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';

const Navbar = props => {
    const logoutAndLiftUserState = () => {
        AUTH_SERVICE
            .logout()
            .then(() => props.onUserChange(null))
            .catch(err => console.log({ err }));
    };

    return (
        <nav>
            <Link to='/'> Home </Link>
            <Link to='/signup'> Signup </Link>
            <Link to='/login'> Login </Link>
            <Link to='/profile'> Profile </Link>
            <button onClick={logoutAndLiftUserState}> Logout </button>
        </nav>
    )

}

export default Navbar;
