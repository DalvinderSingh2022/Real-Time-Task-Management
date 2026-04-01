import React, { memo, useCallback, useContext, useMemo, useState } from "react";

import authStyles from "../styles/auth.module.css";
import modalStyles from "../styles/modal.module.css";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { tasks, users } from "../utils/apiendpoints";
import { socket } from "../hooks/useSocket";
import Response from "./Response";

const baseUrl = "https://api.dicebear.com/9.x/fun-emoji/svg?radius=50&scale=75";

const options = {
  mouth: [
    "plain",
    "lilSmile",
    "sad",
    "shy",
    "cute",
    "wideSmile",
    "shout",
    "smileTeeth",
    "smileLol",
    "pissed",
    "drip",
    "tongueOut",
    "kissHeart",
    "sick",
    "faceMask",
  ],
  eyes: [
    "sad",
    "tearDrop",
    "pissed",
    "cute",
    "wink",
    "wink2",
    "plain",
    "glasses",
    "closed",
    "love",
    "stars",
    "shades",
    "closed2",
    "crying",
    "sleepClose",
  ],
  backgroundColor: [
    "A2D9FF",
    "0099FF",
    "00CBA9",
    "FD81CB",
    "FC9561",
    "FFE55A",
    "E3E3E3",
    "FF4848",
  ],
};

const UpdateProfile = ({ remove }) => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);
  const [response, setResponse] = useState(false);
  const [profile, setProfile] = useState(() => {
    const avatar = authState.user.avatar;
    const params = avatar.split("?")[1];
    const pairs = params?.split("&") || [];

    const parsed = { name: authState.user.name };

    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (options[key]) parsed[key] = value;
    });

    return parsed;
  });

  const getAvatarUrl = useCallback(
    (avatar = {}) => {
      let url = `${baseUrl}&seed=${authState.user.name}`;
      if (avatar.mouth) url += `&mouth=${avatar.mouth}`;
      if (avatar.eyes) url += `&eyes=${avatar.eyes}`;
      if (avatar.backgroundColor)
        url += `&backgroundColor=${avatar.backgroundColor}`;

      return url;
    },
    [authState.user.name],
  );

  const avatarUrl = useMemo(
    () => getAvatarUrl(profile),
    [profile, getAvatarUrl],
  );

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (
      profile.name === authState.user.name &&
      avatarUrl === authState.user.avatar
    ) {
      return addToast({ type: "error", message: "No changes made to save" });
    }

    setResponse(true);

    try {
      const userData = await users.update({
        name: profile.name,
        avatar: avatarUrl,
      });

      socket.emit("user_update", userData.user);
      addToast({ type: "success", message: userData.message });
      remove();

      const taskData = await tasks.all();

      taskData.tasks.forEach((task) => {
        let updated = false;
        const updatedTask = { ...task };

        if (task.assignedBy._id === userData.user._id) {
          updatedTask.assignedBy = {
            ...task.assignedBy,
            avatar: userData.user.avatar,
          };
          updated = true;
        }

        const newAssignedTo = task.assignedTo.map((u) => {
          if (u._id === userData.user._id) {
            updated = true;
            return { ...u, avatar: userData.user.avatar };
          }
          return u;
        });

        if (updated) {
          updatedTask.assignedTo = newAssignedTo;
          socket.emit("task_updated", updatedTask);
        }
      });
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
      <div
        className="modal flex full_container profile_update"
        onClick={remove}
      >
        <div
          className={`flex col ${authStyles.container} ${modalStyles.container}`}
          onClick={(e) => e.stopPropagation()}
        >
          <form
            className="flex col gap w_full modal_child"
            onSubmit={handlesubmit}
          >
            <img
              rel="prefetch"
              src={avatarUrl}
              alt="User Avatar"
              className="profile_avatar"
            />

            <div className={`flex col w_full items-stretch ${authStyles.group}`}>
              <input
                type="text"
                placeholder="Name"
                className="profile_name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {Object.entries(options).map(([key, value]) => (
              <div
                key={key}
                className={`flex col w_full profile_group items-stretch ${authStyles.group}`}
              >
                <label htmlFor="status" className="text_primary">
                  {key.slice(0, 1).toUpperCase() + key.slice(1)}
                </label>
                <div className={`flex col w_full items-stretch ${authStyles.group}`}>
                  <div className={`${modalStyles.check_container} flex`}>
                    {value.map((option) => (
                      <label key={option} className={modalStyles.checkbox}>
                        <input
                          type="checkbox"
                          checked={profile[key] === option}
                          onChange={() =>
                            setProfile((p) => ({ ...p, [key]: option }))
                          }
                        />
                        <img
                          className={`avatar ${modalStyles.check_label}`}
                          src={getAvatarUrl({ ...profile, [key]: option })}
                          alt={option}
                          title={option}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className={`flex gap`}>
              <button
                type="submit"
                className={`button primary flex gap2 ${authStyles.submit_button}`}
              >
                Save{response && <div className="loading"></div>}
              </button>
              <button
                type="button"
                className={`button secondary ${authStyles.submit_button}`}
                onClick={remove}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default memo(UpdateProfile);
