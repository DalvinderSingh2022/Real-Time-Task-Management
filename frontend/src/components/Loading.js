import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className='full_container flex col loader'>
            <div>{message}</div>
            <span></span>
        </div>
    )
}

export default Loading;