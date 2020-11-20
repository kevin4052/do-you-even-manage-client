import React from 'react'

export default function MemberCard({ members }) {

    return (
        <div className='member-card'>
            <div className="member-card-header">
                <h5>Team Members</h5>
            </div>
            <div className="member-card-body">
                {
                    members?.map(member => 
                        <div key={`team-member${member._id}`}>
                            <img src={member.profileImg} alt=''/>
                            <h4>{member.firstName} {member.lastName}</h4>
                        </div>)
                }                
            </div>            
        </div>
    )
}
