import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from '../styles/taskdetails.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';

const TaksComments = () => {
    const { addToast } = useContext(AppContext);
    const { authState } = useContext(AuthContext)
    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState('');
    const { id } = useParams()

    useEffect(() => {
        (async () => {
            await axios.get(`http://localhost:4000/api/comments/${id}`)
                .then(({ data }) => {
                    setComments(data.comments);
                })
                .catch((error) => {
                    console.error(error);
                    addToast({ type: 'error', message: error?.response?.data?.message });
                });
        })();
    }, [id, addToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post(`http://localhost:4000/api/comments/${id}`, {
            comment,
            userId: authState.user._id
        })
            .then(({ data }) => {
                setComment('');
            })
            .catch((error) => {
                console.error(error);
                addToast({ type: 'error', message: error?.response?.data?.message });
            });
    }

    return (
        <div className={`flex col ${styles.wrapper} ${styles.comments} ${authStyles.container}`}>
            <header className={`flex ${homeStyles.header}`}>
                <h2 className='text_primary'>Comments</h2>
            </header>
            <div className={`flex col ${styles.messages}`}>
                {comments?.length > 0 ?
                    comments.map(comment =>
                    (<div key={comment._id} className={`${styles.message}`}>
                        <div>{comment.comment}</div>
                        <span className='text_secondary'>{comment.user._id === authState.user._id ? "You" : comment.user.name} on {new Date(comment.createdAt).toLocaleString()}</span>
                    </div>))
                    : comments && <div className='loading'></div>}

            </div>
            <form className={`flex col gap w_full modal_child`} onSubmit={handleSubmit}>
                <div className={`flex col w_full ${authStyles.group}`}>
                    <div className={`flex gap2`}>
                        <input
                            type="text"
                            placeholder='comment'
                            className='w_full'
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button className={`button primary flex gap2 ${authStyles.submit_button}`}>Add</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TaksComments;