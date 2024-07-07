import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <main>
            {/* <Sidebar /> */}
            {/* <Topbar /> */}
            <article>
                <Outlet />
            </article>
        </main>
    )
}

export default Layout;