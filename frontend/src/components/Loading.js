import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className='full_container flex'>
            <div>{message}</div>
        </div>
    )
}

export default Loading;