import React, { useContext } from 'react';

import { AuthContext } from '../store/AuthContext';

const Home = () => {
    const { authState } = useContext(AuthContext);
    return (
        <div>
            {authState.user.name}
        </div>
    )
}

export default Home;