import React, { useContext } from 'react';

import { CgMenuRightAlt } from "react-icons/cg";

import { AuthContext } from '../store/AuthContext';

const greeting = () => {
    const currentTime = new Date().getHours();
    const morning = `Good morning`;
    const afternoon = `Good afternoon`;
    const evening = `Good evening`;

    return currentTime < 12 ? morning : currentTime < 17 ? afternoon : evening;
};

const Topbar = () => {
    const { authState } = useContext(AuthContext);

    return (
        <nav className='top_nav flex'>
            <div className="flex gap">
                <button className='menu_toggle button flex primary round' onClick={() => document.querySelector("main").classList.toggle('close')}>
                    <CgMenuRightAlt />
                </button>
                <div className='greeting text_primary'>{"Welcome, " + greeting()}</div>
            </div>
            <div className="user_profile flex gap2">
                <div className="flex col">
                    <div className="name">{authState.user.name}</div>
                    <div className="email">{authState.user.email}</div>
                </div>
            </div>
        </nav>
    )
}

export default Topbar;