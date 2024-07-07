import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className='full-container flex'>
            <div>{message}</div>
        </div>
    )
}

export default Loading;