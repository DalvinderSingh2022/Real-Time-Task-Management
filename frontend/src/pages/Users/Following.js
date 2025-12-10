import React, { useContext } from "react";

import styles from "../../styles/users.module.css";

import { AuthContext } from "../../store/AuthContext";
import useSearch from "../../hooks/useSearch";
import User from "../../components/User";
import SearchInput from "./SearchInput";

const Following = () => {
  const { authState } = useContext(AuthContext);
  const [handleChange, users, query] = useSearch(
    authState?.user?.following,
    "name"
  );

  return (
    <article>
      <SearchInput handleChange={handleChange} query={query} />
      <div className={styles.container}>
        <div className={`flex gap wrap ${styles.wrapper}`}>
          {users?.length > 0 ? (
            users.map((user) => <User {...user} key={user._id} />)
          ) : users ? (
            <div className="text_secondary flex">
              There is no following user
            </div>
          ) : (
            <div className="loading"></div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Following;
