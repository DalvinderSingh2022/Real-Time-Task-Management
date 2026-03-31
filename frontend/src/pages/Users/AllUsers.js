import React, { memo, useContext, useMemo } from "react";

import styles from "../../styles/users.module.css";

import { UsersContext } from "../../store/UsersContext";
import useSearch from "../../hooks/useSearch";
import User from "../../components/User";
import SearchInput from "./SearchInput";

const AllUsers = () => {
  const {
    usersState: { users: allUsers },
  } = useContext(UsersContext);

  const [handleChange, filteredUsers, search] = useSearch(allUsers, "name");

  const renderedUsers = useMemo(() => {
    if (!filteredUsers) return null;
    return filteredUsers.map((user) => <User {...user} key={user._id} />);
  }, [filteredUsers]);

  return (
    <article>
      {allUsers.length === 0 ? (
        <div className={`flex col gap2 ${styles.container}`}>
          <div className={`flex col gap ${styles.header}`}>
            <div className="text_primary heading">Users</div>
            <div className="text_secondary">
              View and manage members of your organization.
            </div>
          </div>

          <div className="text_secondary">
            No users available in this organization.
          </div>
        </div>
      ) : (
        <>
          <SearchInput handleChange={handleChange} query={search} />
          <div className={styles.container}>
            <div className={`flex gap wrap ${styles.wrapper}`}>
              {filteredUsers?.length > 0 ? (
                renderedUsers
              ) : filteredUsers ? (
                <div className="text_secondary flex">There is no user</div>
              ) : (
                <div className="loading"></div>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
};

export default memo(AllUsers);
