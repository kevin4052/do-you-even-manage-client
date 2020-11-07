import React, { Component } from 'react';
import SideNav from '../SideNav';

export default class Home extends Component {
    render() {
        return (
            <div className='flex-row'>
                <SideNav />
                <div className='center-content'>
                    <h2>Home page</h2>
                    {
                        this.props.currentUser && <h4>Welcome {this.props.currentUser.firstname}</h4>
                    }
                </div>                
            </div>
        )
    }
}
