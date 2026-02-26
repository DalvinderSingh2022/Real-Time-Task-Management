import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../store/AuthContext";
import { TasksContext } from "../store/TasksContext";

import styles from "../styles/home.module.css";
import userStyles from "../styles/users.module.css";
import tasksStyles from "../styles/tasks.module.css";

import User from "../components/User";
import Task from "../components/Task";

const Home = () => {
  const { authState } = useContext(AuthContext);
  const { tasksState } = useContext(TasksContext);

  const followersList = authState.user?.followers || [];
  const followingList = authState.user?.following || [];

  const tasks = useMemo(() => tasksState.tasks || [], [tasksState.tasks]);
  const { notStarted, inProgress, completed } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const status = task.status?.toLowerCase().replaceAll(" ", "");

        if (status === "notstarted") acc.notStarted++;
        if (status === "inprogress") acc.inProgress++;
        if (status === "completed") acc.completed++;

        return acc;
      },
      { notStarted: 0, inProgress: 0, completed: 0 },
    );
  }, [tasks]);

  const totalTasks = notStarted + inProgress + completed;
  const followers = followersList.length;
  const following = followingList.length;
  const totalConnections = followers + following;

  return (
    <article className={styles.article}>
      <section className={styles.graph}>
        <header>
          <h2 className="text_primary">Tasks</h2>
          <h4 className="text_secondary">Tasks Allocated by Current Status</h4>
        </header>
        <div className={`flex col gap ${styles.graph_wrapper}`}>
          <div className="total">
            <span className={styles.graph_total}>{tasks.length}</span>
            <h4>Tasks</h4>
          </div>
          <div className={`flex ${styles.graph_bar}`}>
            <Link
              to="/tasks?status=Completed"
              className={styles.bar_child}
              style={{
                width: totalTasks ? `${(completed / totalTasks) * 100}%` : "0%",
                backgroundColor: "var(--green)",
              }}
            />
            <Link
              to="/tasks?status=In+Progress"
              className={styles.bar_child}
              style={{
                width: totalTasks
                  ? `${(inProgress / totalTasks) * 100}%`
                  : "0%",
                backgroundColor: "var(--blue)",
                transitionDelay: "0.2s",
              }}
            />
            <Link
              to="/tasks?status=Not+Started"
              className={styles.bar_child}
              style={{
                width: totalTasks
                  ? `${(notStarted / totalTasks) * 100}%`
                  : "0%",
                backgroundColor: "var(--grey)",
                transitionDelay: "0.4s",
              }}
            />
          </div>
          <div className="flex col gap2">
            <div className={`flex gap2 ${styles.legend}`}>
              <div style={{ backgroundColor: "var(--green)" }} />
              <span>Completed: {completed}</span>
            </div>
            <div className={`flex gap2 ${styles.legend}`}>
              <div style={{ backgroundColor: "var(--blue)" }} />
              <span>In Progress: {inProgress}</span>
            </div>
            <div className={`flex gap2 ${styles.legend}`}>
              <div style={{ backgroundColor: "var(--grey)" }} />
              <span>Not Started: {notStarted}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.graph}>
        <header>
          <h2 className="text_primary">Users</h2>
          <h4 className="text_secondary">Connected Users by Relation</h4>
        </header>
        <div className={`flex col gap ${styles.graph_wrapper}`}>
          <div className="total">
            <span className={styles.graph_total}>{totalConnections}</span>
            <h4>Connections</h4>
          </div>
          <div className={`flex ${styles.graph_bar}`}>
            <Link
              to="/users/followers"
              className={styles.bar_child}
              style={{
                width: totalConnections
                  ? `${(followers / totalConnections) * 100}%`
                  : "0%",
                backgroundColor: "var(--purple-light)",
              }}
            />
            <Link
              to="/users/following"
              className={styles.bar_child}
              style={{
                width: totalConnections
                  ? `${(following / totalConnections) * 100}%`
                  : "0%",
                backgroundColor: "var(--purple-dark)",
                transitionDelay: "0.2s",
              }}
            />
          </div>
          <div className="flex col gap2">
            <div className={`flex gap2 ${styles.legend}`}>
              <div style={{ backgroundColor: "var(--purple-light)" }} />
              <span>Followers: {followers}</span>
            </div>
            <div className={`flex gap2 ${styles.legend}`}>
              <div style={{ backgroundColor: "var(--purple-dark)" }} />
              <span>Following: {following}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tasks}>
        <header className={`flex ${styles.header}`}>
          <h3 className="text_primary">Recent Tasks</h3>
        </header>
        <div
          className={`flex col gap2 ${tasksStyles.tasks_container} ${styles.tasks_wrapper}`}
        >
          {tasks.length ? (
            tasks.slice(0, 3).map((task) => <Task {...task} key={task._id} />)
          ) : tasksState.loaded ? (
            <div className="text_secondary flex">There is no task</div>
          ) : (
            <div className={`loading ${styles.loading}`} />
          )}
        </div>
      </section>

      <section className={styles.followers}>
        <header className={`flex ${styles.header}`}>
          <h3 className="text_primary">Your Followers</h3>
        </header>
        <div
          className={`flex gap2 wrap ${userStyles.wrapper} ${styles.followers_wrapper}`}
        >
          {followers ? (
            followersList.map((user) => <User {...user} key={user._id} />)
          ) : authState.authenticated ? (
            <div className="text_secondary flex">There is no follower</div>
          ) : (
            <div className="loading" />
          )}
        </div>
      </section>
    </article>
  );
};

export default Home;
