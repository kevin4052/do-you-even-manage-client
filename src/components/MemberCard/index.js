import React from 'react'

export default function MemberCard({member}) {
    const { firstName, lastName, profileImg } = member;
    // console.log({firstName});

    return (
        <div className='member-card'>
            <div className="member-card-header">
                <h5>Team Members</h5>
            </div>
            <div className="member-card-body">
                <img src={profileImg} alt=''/>
                <h4>{firstName} {lastName}</h4>
            </div>            
        </div>
    )
}
