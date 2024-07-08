import React from 'react';

import { CgMenuRightAlt } from "react-icons/cg";

const greeting = () => {
    const currentTime = new Date().getHours();
    const morning = `Good morning`;
    const afternoon = `Good afternoon`;
    const evening = `Good evening`;

    return currentTime < 12 ? morning : currentTime < 17 ? afternoon : evening;
};

const Topbar = () => {
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
                    <div className="name">Dalvinder Singh</div>
                    <div className="email">dalvindersingh201999@gmail.com</div>
                </div>
            </div>
        </nav>
    )
}

export default Topbar;