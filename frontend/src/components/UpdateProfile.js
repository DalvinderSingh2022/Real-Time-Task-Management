import React, { memo, useCallback, useContext, useEffect, useState } from 'react';

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from '../store/AuthContext';

const baseUrl = 'https://api.dicebear.com/9.x/fun-emoji/svg?radius=50&scale=75';
const options = {
    mouth: ["plain", "lilSmile", "sad", "shy", "cute", "wideSmile", "shout", "smileTeeth", "smileLol", "pissed", "drip", "tongueOut", "kissHeart", "sick", "faceMask"],
    eyes: ["sad", "tearDrop", "pissed", "cute", "wink", "wink2", "plain", "glasses", "closed", "love", "stars", "shades", "closed2", "crying", "sleepClose"],
    backgroundColor: ["A2D9FF", "0099FF", "00CBA9", "FD81CB", "FC9561", "FFE55A", "E3E3E3", "FF4848"]
}

const UpdateProfile = ({ remove }) => {
    const { authState } = useContext(AuthContext);
    const [profile, setProfile] = useState({ name: authState.user.name, avatar: authState.user.avatar });

    const getAvatar = useCallback(({ mouth, eyes, backgroundColor }) => {
        let avatar = `${baseUrl}&seed=${profile.name}`;

        if (mouth) avatar += `&mouth=${mouth}`;
        if (eyes) avatar += `&eyes=${eyes}`;
        if (backgroundColor) avatar += `&backgroundColor=${backgroundColor}`;

        return avatar
    }, [profile.name]);

    const handlesubmit = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const params = authState.user.avatar.split('?')[1];
        const pairs = params.split('&');

        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key === 'mouth' || key === 'eyes' || key === 'backgroundColor') {
                setProfile(prev => ({ ...prev, [key]: value }));
            }
        });

        setProfile(prev => ({ ...prev, avatar: getAvatar(prev) }));
    }, [authState.user.avatar, getAvatar]);

    return (
        <>
            <div className="modal flex full_container profile_update" onClick={remove}>
                <div className={` flex col ${authStyles.container} ${modalStyles.container}`} onClick={e => e.stopPropagation()}>
                    <form className={`flex col gap w_full modal_child`} onSubmit={handlesubmit}>
                        <img src={getAvatar(profile) || authState.user.avatar} alt="User Avatar" className='profile_avatar' />
                        <div className={`flex col w_full ${authStyles.group}`}>
                            <input
                                type="text"
                                placeholder='Name'
                                className='profile_name'
                                value={profile.name}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        {Object.entries(options).map(([key, value]) => (
                            <div key={value} className={`flex col w_full profile_group ${authStyles.group}`}>
                                <label htmlFor="status" className='text_primary'>{key.slice(0, 1).toUpperCase() + key.slice(1)}</label>
                                <div key={value} className={`flex col w_full ${authStyles.group}`}>
                                    <div className={`${modalStyles.check_container} flex`}>
                                        {value.map((option) => (
                                            <label key={option} htmlFor={option} className={modalStyles.checkbox}>
                                                <input
                                                    type="checkbox"
                                                    id={option}
                                                    checked={profile[key] === option}
                                                    onChange={() => setProfile(prev => ({ ...prev, [key]: option }))}
                                                />
                                                <img className={`flex avatar ${modalStyles.check_label}`} alt={option} title={option} src={`${getAvatar(({ ...profile, [key]: option }))}`} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className={`flex gap`}>
                            <button type='submit' className={`button primary flex gap2 ${authStyles.submit_button}`}>Save</button>
                            <button type='button' className={`button secondary ${authStyles.submit_button}`} onClick={remove}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default memo(UpdateProfile);