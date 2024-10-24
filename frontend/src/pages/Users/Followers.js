import React, { useContext } from 'react';

import styles from "../../styles/users.module.css";

import { AuthContext } from '../../store/AuthContext';
import useSearch from '../../hooks/useSearch';
import User from '../../components/User';
import SearchInput from './SearchInput';

const Followers = () => {
    const { authState } = useContext(AuthContext);
    const [handleChange, users] = useSearch(authState?.user?.followers, 'name');

    return (
        <article>
            <SearchInput handleChange={handleChange} />
            <div className={styles.container}>
                <div className={`flex gap wrap ${styles.wrapper}`}>
                    {users?.length > 0
                        ? users.map(user => <User {...user} key={user._id} />)
                        : users ? <div className='text_secondary flex'>There is no follower</div> : <div className="loading"></div>
                    }
                </div>
            </div>
        </article>
    )
}

export default Followers;