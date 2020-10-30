import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div>
                <h2>Home page</h2>
                {
                    this.props.currentUser && <h4>Welcome {this.props.currentUser.username}</h4>
                }
            </div>
        )
    }
}
