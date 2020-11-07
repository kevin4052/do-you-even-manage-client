import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Landing extends Component {

    render() {
        return (
            <div>
                <div className='center-content'>
                    <div className='form'>
                        <Link to='/signup'><button style={{width: '100%'}}>Signup</button></Link>
                       <Link to='/login'> <button style={{width: '100%'}}>Login</button></Link>
                    </div>
                </div>
            </div>
        )
    }
}
