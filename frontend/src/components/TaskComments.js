import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from "../styles/taskdetails.module.css";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { socket } from "../hooks/useSocket";
import { comments } from "../utils/apiendpoints";
import Response from "./Response";

const TaskComments = ({ task }) => {
  const { addToast } = useContext(AppContext);
  const { authState } = useContext(AuthContext);

  const [allComments, setAllComments] = useState(null);
  const [comment, setComment] = useState("");
  const [response, setResponse] = useState(false);

  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPos, setCursorPos] = useState(0);

  const { id } = useParams();
  const messagesRef = useRef(null);
  const textAreaRef = useRef(null);

  const participants = task
    ? task.assignedTo?.find((u) => u._id === task.assignedBy._id)
      ? [...task.assignedTo]
      : [task.assignedBy, ...task.assignedTo]
    : [];

  useEffect(() => {
    comments
      .get(id)
      .then(({ data }) => setAllComments(data.comments))
      .catch((error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message || error?.message,
        });
        console.log(".....API ERROR.....", error);
      });
  }, [id, addToast]);

  useEffect(() => {
    if (!task) return;

    const userId = authState.user._id;
    const isAssigned =
      userId === task.assignedBy._id ||
      task.assignedTo.some((u) => u._id === userId);

    if (!isAssigned) socket.emit("join_room", id);
    return () => !isAssigned && socket.emit("leave_room", id);
  }, [id, task, authState]);

  useEffect(() => {
    socket.on("update_comments", (comment) => {
      setAllComments((prev) => [...prev, comment]);

      if (authState.user._id !== comment.user._id) {
        addToast({
          type: "info",
          message: `${task.title}: new comment by ${comment.user.name}`,
        });
      }
    });

    return () => socket.off("update_comments");
  }, [addToast, task, authState]);

  useEffect(() => {
    if (messagesRef.current) {
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 0);
    }
  }, [allComments]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [comment]);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);

    const pos = e.target.selectionStart;
    setCursorPos(pos);

    const sliced = value.slice(0, pos);
    const match = sliced.match(/@([\w ]*)$/);

    if (match) {
      setMentionQuery(match[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const filteredMentions = participants.filter((u) =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleMentionSelect = (user) => {
    const before = comment.slice(0, cursorPos).replace(/@[\w ]*$/, "");
    const after = comment.slice(cursorPos);

    const newValue = `${before}@${user.name} ${after}`;
    setComment(newValue);
    setShowMentions(false);

    setTimeout(() => {
      textAreaRef.current.focus();
      const newCursor = (before + "@" + user.name + " ").length;
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd =
        newCursor;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setResponse(true);

    comments
      .create(id, { comment })
      .then(({ data }) => {
        socket.emit("send_comment", data.comment, id);
        setComment("");
      })
      .catch((error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message || error?.message,
        });
        console.log(".....API ERROR.....", error);
      })
      .finally(() => setResponse(false));
  };

  return (
    <>
      {response && <Response />}

      <section
        className={`flex col ${styles.wrapper} ${styles.comments} ${authStyles.container}`}
      >
        <header className={`flex ${homeStyles.header}`}>
          <h2 className="text_primary">Comments</h2>
        </header>

        {task ? (
          <>
            <div className={`flex col ${styles.messages}`} ref={messagesRef}>
              {allComments?.length > 0 ? (
                allComments.map((com) => (
                  <Comment {...com} authState={authState} key={com._id} />
                ))
              ) : allComments ? (
                <div className="text_secondary flex">No comments</div>
              ) : (
                <div className="loading"></div>
              )}
            </div>

            <form className={`flex col gap w_full`} onSubmit={handleSubmit}>
              <div className={`flex col w_full ${authStyles.group} relative`}>
                <div className={`flex gap2`}>
                  <textarea
                    ref={textAreaRef}
                    rows="1"
                    placeholder="comment"
                    className="w_full"
                    value={comment}
                    onChange={handleCommentChange}
                  />

                  <button className={`button primary flex gap2`}>
                    Add {response && <div className="loading"></div>}
                  </button>
                </div>

                {showMentions && (
                  <div
                    className={styles.mentionDropdown}
                    style={{
                      position: "absolute",
                      bottom: "90px",
                      left: "0",
                      zIndex: 20,
                      background: "white",
                      borderRadius: "6px",
                      width: "250px",
                      maxHeight: "160px",
                      overflowY: "auto",
                      padding: "4px 0",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {filteredMentions.length ? (
                      filteredMentions.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleMentionSelect(user)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                          }}
                          className={styles.mentionItem}
                        >
                          @{user.name}
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "8px 12px",
                          color: "#888",
                        }}
                      >
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="loading"></div>
        )}
      </section>
    </>
  );
};

const highlightMentions = (text) => {
  return text.replace(
    /@([A-Za-z0-9 _]+)/g,
    (match) => `<span style="color:#925bc8;font-weight:600;">${match}</span>`
  );
};

const Comment = memo(
  ({ _id, comment, user, createdAt, authState }) => (
    <div key={_id} className={styles.message}>
      <div dangerouslySetInnerHTML={{ __html: highlightMentions(comment) }} />
      <div className={styles.comment_date}>
        <span
          className={
            user._id === authState.user._id ? "text_primary" : "text_secondary"
          }
        >
          {user.name}
        </span>{" "}
        on {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  ),
  (prev, next) => prev._id === next._id
);

export default TaskComments;
