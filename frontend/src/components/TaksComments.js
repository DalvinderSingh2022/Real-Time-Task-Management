import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from '../styles/taskdetails.module.css';

import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';
import { socket } from '../hooks/useSocket';
import { comments } from '../utils/apiendpoints';
import Response from './Response';

const TaksComments = ({ task }) => {
    const { addToast } = useContext(AppContext);
    const { authState } = useContext(AuthContext);
    const [allComments, setAllComments] = useState(null);
    const [comment, setComment] = useState('');
    const [response, setResponse] = useState(false);
    const { id } = useParams();
    const messagesRef = useRef(null);

    useEffect(() => {
        comments.get(id).then(({ data }) => setAllComments(data.comments))
            .catch((error) => {
                addToast({ type: 'error', message: error?.response?.data?.message || error?.message });
                console.log(".....API ERROR.....", error);
            });
    }, [id, addToast]);

    useEffect(() => {
        if (!task) return;

        const userId = authState.user._id;
        const isUserAssigned = userId === task.assignedBy._id || task.assignedTo.some(user => user._id === userId);

        if (!isUserAssigned) {
            socket.emit("join_room", id);
        }

        return () => {
            if (!isUserAssigned) {
                socket.emit("leave_room", id);
            }
        };
    }, [id, task, authState]);

    useEffect(() => {
        socket.on('update_comments', (comment) => {
            setAllComments(prev => [...prev, comment]);
            if (authState.user._id !== comment.user._id) {
                addToast({ type: 'info', message: `${task.title}: new comment by ${comment.user.name}` });
            }
        });

        return () => socket.off("update_comments");
    }, [allComments, addToast, task, authState]);

    useEffect(() => {
        if (messagesRef.current) {
            setTimeout(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight, 0);
        }
    }, [allComments, task]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setResponse(true);
        comments.create(id, comment).then(({ data }) => {
            socket.emit('send_comment', data.comment, id);
            setComment('');
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
            <section className={`flex col ${styles.wrapper} ${styles.comments} ${authStyles.container}`}>
                <header className={`flex ${homeStyles.header}`}>
                    <h2 className='text_primary'>Comments</h2>
                </header>
                {task ?
                    <>
                        <div className={`flex col ${styles.messages}`} ref={messagesRef}>
                            {allComments?.length > 0
                                ? allComments.map(comment => <Comment {...comment} authState={authState} key={comment._id} />)
                                : allComments ? <div className='text_secondary flex'>No comments</div> : <div className='loading'></div>
                            }
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
                                    <button className={`button primary flex gap2`}>Add{response && <div className='loading'></div>}</button>
                                </div>
                            </div>
                        </form>
                    </>
                    : <div className='loading'></div>
                }
            </section>
        </>
    )
}

const Comment = memo(({ _id, comment, user, createdAt, authState }) =>
    <div key={_id} className={`${styles.message}`}>
        <div>{comment}</div>
        <div className={`text_secondary ${styles.comment_date}`}>{user.name + (user._id === authState.user._id ? "(You)" : '')} on {new Date(createdAt).toLocaleString()}</div>
    </div>
    , (prev, next) => prev?._id === next?._id);

export default TaksComments;