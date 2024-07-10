import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className='full_container flex col loader'>
            <div>{'Fetching Users details, please wait...'}</div>
            <span></span>
        </div>
    )
}

export default Loading;