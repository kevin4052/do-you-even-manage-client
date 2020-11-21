import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
    return (
        <div className='loading-logo'>
            <div className='loading-lol-spin'>
                <FontAwesomeIcon icon={faSpinner} />
            </div>            
        </div>
    )
}
