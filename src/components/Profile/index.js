import React, { Component } from 'react';
import AUTH_SERVICE from '../../services/AuthService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            editForm: false,
            deleteUser: false,
        }
    }

    componentDidMount = () => {
        AUTH_SERVICE
        .getAuthenticatedUser()
        .then(responseFromServer => {
            const { user } = responseFromServer.data;
            this.props.onUserChange(user);
            this.setState({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            })
        })
        .catch(err => console.log({ err }));
    }

    editProfile = () => {
        console.log('edit')
        const { editForm } = this.state;
        this.setState({ editForm: !editForm });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = () => {
        const { firstName, lastName, email, editForm } = this.state;

        AUTH_SERVICE
        .updateCurrentUser({ firstName, lastName, email })
        .then(responseFromServer => {
            const { user } = responseFromServer.data;
            this.props.onUserChange(user);
            this.setState({ editForm: !editForm})
        })
        .catch(err => console.log({ err }));
    }

    deleteUser = () => {
        const { deleteUser } = this.state;
        this.setState({ deleteUser: !deleteUser});
    }

    // confirmDeleteUser = () => {
    //     AUTH_SERVICE
    //     .deleteUser()
    //     .then(() => {

    //     })
    //     .catch(err => console.log({ err }));
    // }



    render() {
        const { firstName, lastName, email, profileImg, teams, tasks } = this.props.currentUser;

        return (
            <div className='main-panel'>
                {
                    this.state.editForm
                    ?<div className='profile-card'>
                        <img src={profileImg} alt='user-img' />
                        <div className='profile-card-info'>
                            <div className='user-info'>
                                <input name='firstName' value={this.state.firstName} onChange={this.handleChange} />
                                <input name='lastName' value={this.state.lastName} onChange={this.handleChange} />
                                <br />
                                <input name='email' value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className='edit-profile'>
                            <button onClick={this.handleFormSubmit}>update</button>
                        </div>
                    </div>
                    :<div className='profile-card'>
                        <img src={profileImg} alt='user-img' />
                        <div className='profile-card-info'>
                            <div className='user-info'>
                                <h3>{firstName} {lastName}</h3>
                                <p>{email}</p>
                            </div>
                        </div>
                        <div className='edit-profile'>
                            <FontAwesomeIcon icon={faEdit} onClick={() => this.editProfile()} />
                            <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.deleteUser()} />
                        </div>
                    </div>                
                }
                <div className='user-stats'>
                    <div>
                        <h4>{teams.length}</h4>
                        <h3>TEAMS</h3>
                    </div>
                    <div>
                        <h4>{tasks.length}</h4>
                        <h3>TASKS</h3>
                    </div>
                </div>
                {
                    this.state.deleteUser &&
                    <div className='modal display'>
                        <div className='modal-content delete-account'>
                            <h4>Are you sure you want to delete your account</h4>
                            <button onClick={this.confirmDeleteUser}>confirm</button>
                            <div className='delete-account-cancel'>
                                <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.deleteUser()} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
