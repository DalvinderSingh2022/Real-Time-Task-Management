import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from '../styles/taskdetails.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { SocketContext } from '../store/SocketContext';
import Response from './Response';

const TaksComments = () => {
    const { addToast } = useContext(AppContext);
    const { socketState } = useContext(SocketContext);
    const { authState } = useContext(AuthContext);
    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState('');
    const [response, setResponse] = useState(false);
    const { id } = useParams();
    const messagesRef = useRef(null);

    useEffect(() => {
        (async () => {
            await axios.get(`https://task-manager-v4zl.onrender.com/api/comments/${id}`)
                .then(({ data }) => {
                    setComments(data.comments);
                })
                .catch((error) => {
                    console.error(error);
                    addToast({ type: 'error', message: error?.response?.data?.message });
                });
        })();
    }, [id, addToast]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.emit("join_room", id);

        return () => socketState.socket.emit("leave_room", id);
    }, [socketState, id]);

    useEffect(() => {
        if (!socketState.connected) return;

        socketState.socket.on('update_comments', (comment) => {
            setComments(prev => [...prev, comment]);
            setTimeout(() => {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }, 0);
        });

        return () => socketState.socket.off("update_comments");
    }, [comments, socketState]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setResponse(true);
        await axios.post(`https://task-manager-v4zl.onrender.com/api/comments/${id}`,
            {
                comment,
                userId: authState.user._id
            })
            .then(({ data }) => {
                socketState.socket.emit('send_comment', data.comment, id);
                setComment('');
            })
            .catch((error) => {
                console.error(error);
                addToast({ type: 'error', message: error?.response?.data?.message });
            })
            .finally(() => setResponse(false));
    }

    return (
        <>
            {response && <Response />}
            <div className={`flex col ${styles.wrapper} ${styles.comments} ${authStyles.container}`}>
                <header className={`flex ${homeStyles.header}`}>
                    <h2 className='text_primary'>Comments</h2>
                </header>
                <div className={`flex col ${styles.messages}`} ref={messagesRef}>
                    {comments?.length > 0
                        ? comments.map(comment => <Comment {...comment} authState={authState} key={comment._id} />)
                        : comments ? <div className='text_secondary'>No comments</div> : <div className='loading'></div>
                    }
                </div>
                <form className={`flex col gap w_full modal_child`} onSubmit={handleSubmit}>
                    <div className={`flex col w_full ${authStyles.group}`}>
                        <div className={`flex gap2`}>
                            <input
                                type="text"
                                placeholder='comment'
                                className='w_full'
                                required={true}
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <button className={`button primary flex gap2`}>Add{response && <div className='loading'></div>}</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

const Comment = memo(({ _id, comment, user, createdAt, authState }) => {

    return <div key={_id} className={`${styles.message}`}>
        <div>{comment}</div>
        <span className='text_secondary'>{user._id === authState.user._id ? "You" : user.name} on {new Date(createdAt).toLocaleString()}</span>
    </div>
});

export default TaksComments;