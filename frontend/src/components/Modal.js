import React from 'react';

const Modal = ({ children, remove }) => {
    return (
        <div className='modal full_container' onClick={remove}>
            {children}
        </div>
    )
}

export default Modal;