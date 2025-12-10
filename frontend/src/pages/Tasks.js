import React, { useContext, useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";

import styles from "../styles/tasks.module.css";

import { DragAndDropContext } from "../store/DragAndDropContext";
import { TasksContext } from "../store/TasksContext";
import TaskSection from "../components/TaskSection";
import AddTask from "../components/AddTask";
import useSearch from "../hooks/useSearch";

const TaskStatusTypes = ["Not Started", "In Progress", "Completed"];
const TaskDueTypes = [
  "Due Today",
  "Due Tomorrow",
  "Due Yesterday",
  "Due This Week",
  "Due Last Week",
  "Due This Month",
  "Over due",
];

const Tasks = () => {
  const { tasksState } = useContext(TasksContext);
  const [taskGroups, setTaskGroups] = useState({
    notStarted: [],
    inProgress: [],
    completed: [],
  });
  const [handleChange, tasks, query] = useSearch(
    tasksState.tasks,
    "title",
    "dueStatus"
  );

  useEffect(() => {
    if (!tasks) return;
    const groupedTasks = tasks.reduce(
      (acc, task) => {
        const status = task.status.toLowerCase().replaceAll(" ", "");
        acc[status].push(task);

        return acc;
      },
      { notstarted: [], inprogress: [], completed: [] }
    );

    setTaskGroups(groupedTasks);
  }, [tasks]);

  return (
    <article>
      <SearchInput handleChange={handleChange} query={query} />
      <div className={styles.container}>
        {TaskStatusTypes.map(
          (status) =>
            (!query.get("status") || query.get("status") === status) && (
              <TaskSection
                key={status}
                tasks={taskGroups[status.replaceAll(" ", "").toLowerCase()]}
                status={status}
              />
            )
        )}
      </div>
    </article>
  );
};

const SearchInput = ({ handleChange, query }) => {
  const { response } = useContext(DragAndDropContext);
  const [addTask, setAddTask] = useState(false);

  return (
    <>
      {addTask && <AddTask remove={() => setAddTask(false)} />}
      <form
        className={`${styles.filters} wrap flex gap2`}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          name="q"
          placeholder="search by title"
          value={query.get("q") || ""}
          onChange={handleChange}
        />
        <button
          type="button"
          className={`button primary flex gap2 ${styles.create_btn}`}
          onClick={() => setAddTask(true)}
        >
          <FaPlus />
          <span>Create</span>
        </button>
        <select
          defaultValue={query.get("dueStatus") || ""}
          onChange={handleChange}
          name="dueStatus"
          className="button primary"
        >
          <option value="">All Due Status</option>
          {TaskDueTypes.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          defaultValue={query.get("status") || ""}
          onChange={handleChange}
          name="status"
          className="button primary"
        >
          <option value="">All Status</option>
          {TaskStatusTypes.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {response && <div className="loading" style={{ margin: 0 }}></div>}
      </form>
    </>
  );
};
export default Tasks;
