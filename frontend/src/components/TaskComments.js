import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import authStyles from "../styles/auth.module.css";
import homeStyles from "../styles/home.module.css";
import styles from "../styles/taskdetails.module.css";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { socket } from "../hooks/useSocket";
import { comments } from "../utils/apiendpoints";
import Response from "./Response";

const escapeHTML = (str) =>
  str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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
  const mentionTimeoutRef = useRef(null);

  const currentUserIdRef = useRef(authState.user._id);

  const participants = task
    ? task.assignedTo?.find((u) => u._id === task.assignedBy._id)
      ? [...task.assignedTo]
      : [task.assignedBy, ...task.assignedTo]
    : [];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await comments.get(id);
        setAllComments(data.comments);
      } catch (error) {
        addToast({
          type: "error",
          message: error?.message,
        });
        console.log(".....API ERROR.....", error);
      }
    };

    fetchComments();
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
    const handler = (incomingComment) => {
      setAllComments((prev) => [...prev, incomingComment]);

      if (currentUserIdRef.current !== incomingComment.user._id) {
        addToast({
          type: "info",
          message: `${task.title}: new comment by ${incomingComment.user.name}`,
        });
      }
    };

    socket.on("update_comments", handler);
    return () => socket.off("update_comments", handler);
  }, [addToast, task]);

  useEffect(() => {
    let timeout;
    if (messagesRef.current) {
      timeout = setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 0);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [allComments]);

  useEffect(() => {
    return () => {
      if (mentionTimeoutRef.current) {
        clearTimeout(mentionTimeoutRef.current);
      }
    };
  }, []);

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
    u.name.toLowerCase().includes(mentionQuery.toLowerCase()),
  );

  const handleMentionSelect = (user) => {
    const before = comment.slice(0, cursorPos).replace(/@[\w ]*$/, "");
    const after = comment.slice(cursorPos);

    const newValue = `${before}@${user.name} ${after}`;
    setComment(newValue);
    setShowMentions(false);

    mentionTimeoutRef.current = setTimeout(() => {
      textAreaRef.current.focus();
      const newCursor = (before + "@" + user.name + " ").length;
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd =
        newCursor;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setResponse(true);

    try {
      const data = await comments.create(id, { comment });

      socket.emit("send_comment", data.comment, id);
      setComment("");
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });
      console.log(".....API ERROR.....", error);
    } finally {
      setResponse(false);
    }
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
            <div className={`flex col items-stretch ${styles.messages}`} ref={messagesRef}>
              {allComments?.length > 0 ? (
                allComments.map((com) => (
                  <Comment
                    key={com._id}
                    {...com}
                    currentUserId={authState.user._id}
                  />
                ))
              ) : allComments ? (
                <div className="text_secondary flex">No comments</div>
              ) : (
                <div className="loading"></div>
              )}
            </div>

            <form className={`flex col gap w_full`} onSubmit={handleSubmit}>
              <div className={`flex col w_full items-stretch ${authStyles.group} relative`}>
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
                  <div className={styles.mentionDropdown}>
                    {filteredMentions.length ? (
                      filteredMentions.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleMentionSelect(user)}
                          className={styles.mentionItem}
                        >
                          @{user.name}
                        </div>
                      ))
                    ) : (
                      <div className={styles.mentionItem}>No users found</div>
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

const Comment = memo(
  ({ _id, comment, user, createdAt, currentUserId }) => {
    const formattedComment = useMemo(() => {
      const safe = escapeHTML(comment);
      return safe.replace(
        /@([A-Za-z0-9 _]+)/g,
        (match) => `<span class="mention">${match}</span>`,
      );
    }, [comment]);

    return (
      <div className={styles.message}>
        <div dangerouslySetInnerHTML={{ __html: formattedComment }} />

        <div className={styles.comment_date}>
          <span
            className={
              user._id === currentUserId ? "text_primary" : "text_secondary"
            }
          >
            {user.name}
          </span>{" "}
          on {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    );
  },
  (prev, next) => prev._id === next._id,
);

export default TaskComments;
