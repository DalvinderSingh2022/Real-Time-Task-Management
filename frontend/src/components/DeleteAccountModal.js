import React, { useContext, useState } from 'react';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { users } from '../utils/apiendpoints';
import { socket } from '../hooks/useSocket';
import { AppContext } from '../store/AppContext';
import { AuthContext } from '../store/AuthContext';
import Response from './Response';

const DeleteAccountModal = ({ remove, handleLogout }) => {
    const { authState } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const [response, setResponse] = useState(false);

    const handleDelete = () => {
        setResponse(true);
        users.delete().then(() => {
            socket.emit('user_left', authState.user);
            handleLogout();
        })
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                console.log(".....API ERROR.....", error);
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            <div className="modal flex full_container" onClick={remove}>
                <div className={`flex col gap ${authStyles.container} ${modalStyles.container}`} onClick={e => e.stopPropagation()}>
                    <div>
                        <div className={`w_full text_primary ${authStyles.heading}`}>Are you Sure?</div>
                    </div>
                    <div className="flex gap w_full modal_child">
                        <div className={`flex gap ${modalStyles.group}`}>
                            <button onClick={handleDelete} className={`button flex gap2 ${authStyles.submit_button} ${modalStyles.delete_button}`}>
                                Yes, Delete Account{response && <div className='loading' style={{ borderBottomColor: 'var(--red)' }}></div>}
                            </button>
                            <button onClick={remove} className={`button primary flex gap2 ${authStyles.submit_button}`}>cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteAccountModal