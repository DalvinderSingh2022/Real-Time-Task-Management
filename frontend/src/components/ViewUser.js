import React, { memo, useRef } from "react";
import styles from "../styles/userdetails.module.css";

const ViewUser = ({ user: incomingUser }) => {
  const userRef = useRef(incomingUser);
  const user = userRef.current;

  return (
    <section
      className={`flex col ${styles.wrapper}`}
      onClick={(e) => e.stopPropagation()}
    >
      {user ? (
        <form className="flex col">
          <label htmlFor="profileImage">
            <img
              src={user.profileImage || "https://placehold.co/96x96"}
              alt={user.name}
            />
            <input
              type="file"
              accept="image/*"
              id="profileImage"
              disabled={true}
            />
          </label>
          <div>
            <input
              type="text"
              name="name"
              className="text_primary"
              value={user.name}
              disabled
            />
            <div className="text_secondary">{user.email}</div>
            <div className="text-gray-600">
              Joined {new Date(user.createdAt).toDateString()}
            </div>
            <div className="text-gray-600 mt-2">
              Followers: {user.followers.length}
            </div>
          </div>
        </form>
      ) : (
        <div className="loading"></div>
      )}
    </section>
  );
};

export default memo(ViewUser);
