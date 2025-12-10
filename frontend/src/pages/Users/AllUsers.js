import React, { useContext } from "react";

import styles from "../../styles/users.module.css";

import { UsersContext } from "../../store/UsersContext";
import useSearch from "../../hooks/useSearch";
import User from "../../components/User";
import SearchInput from "./SearchInput";

const AllUsers = () => {
  const { usersState } = useContext(UsersContext);
  const [handleChange, users, query] = useSearch(usersState.users, "name");

  return (
    <article>
      <SearchInput handleChange={handleChange} query={query} />
      <div className={styles.container}>
        <div className={`flex gap wrap ${styles.wrapper}`}>
          {users?.length > 0 ? (
            users.map((user) => <User {...user} key={user._id} />)
          ) : users ? (
            <div className="text_secondary flex">There is no user</div>
          ) : (
            <div className="loading"></div>
          )}
        </div>
      </div>
    </article>
  );
};

export default AllUsers;
