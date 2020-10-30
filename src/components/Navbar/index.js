import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default class index extends Component {
    render() {
        return (
            <nav>
                <Link to='/'>Home</Link>
                <Link to='/signup'>Signup</Link>
            </nav>
        )
    }
}
