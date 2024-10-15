import React from 'react';

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from '../styles/taskdetails.module.css';

const TaksComments = () => {
    return (
        <div className={`flex col ${styles.wrapper} ${styles.comments} ${authStyles.container}`}>
            <header className={`flex ${homeStyles.header}`}>
                <h2 className='text_primary'>Comments</h2>
            </header>
            <div className={`flex col ${styles.messages}`}>
                <div className={`${styles.message}`}>
                    <div>message</div>
                    <span className='text_secondary'>senderName on date, time</span>
                </div>
            </div>
            <form className={`flex col gap w_full modal_child`} onSubmit={(e) => e.preventDefault()}>
                <div className={`flex col w_full ${authStyles.group}`}>
                    <div className={`flex gap2`}>
                        <input
                            type="text"
                            placeholder='comment'
                            className='w_full'
                        />
                        <button className={`button primary flex gap2 ${authStyles.submit_button}`}>Add</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TaksComments;