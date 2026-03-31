import React, { useContext, useMemo, useState } from "react";
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

const normalizeStatus = (status) => status.toLowerCase().replace(/\s/g, "");

const Tasks = () => {
  const { tasksState } = useContext(TasksContext);

  const [handleChange, filteredTasks, query] = useSearch(
    tasksState.tasks,
    "title",
    "dueStatus",
  );

  const taskGroups = useMemo(() => {
    if (!Array.isArray(filteredTasks)) return {};

    return filteredTasks.reduce((acc, task) => {
      const key = normalizeStatus(task.status);

      if (!acc[key]) acc[key] = [];
      acc[key].push(task);

      return acc;
    }, {});
  }, [filteredTasks]);

  return (
    <article>
      {tasksState.tasks.length === 0 ? (
        <div className={`flex col gap2`}>
          <div className={`flex col gap ${styles.header}`}>
            <div className="text_primary heading">Tasks</div>
            <div className="text_secondary">
              Manage and track your tasks efficiently.
            </div>
          </div>

          <div className="text_secondary">
            No tasks found. Start by creating a new task.
          </div>
        </div>
      ) : (
        <>
          <SearchInput handleChange={handleChange} query={query} />
          <div className={styles.container}>
            {TaskStatusTypes.map((status) => {
              const key = normalizeStatus(status);

              if (query.get("status") && query.get("status") !== status)
                return null;

              return (
                <TaskSection
                  key={status}
                  tasks={taskGroups[key] || []}
                  status={status}
                />
              );
            })}
          </div>
        </>
      )}
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
