import React, { useContext, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

import styles from "../styles/tasks.module.css";

import { DragAndDropContext } from "../store/DragAndDropContext";
import { TasksContext } from "../store/TasksContext";
import TaskSection from "../components/TaskSection";
import AddTask from "../components/AddTask";
import EmptyState from "../components/EmptyStateCompoent";

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
  const [addTask, setAddTask] = useState(false);
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
        <EmptyState
          isLoaded={tasksState.loaded}
          title="Tasks & Projects"
          description="Organize your workflow, set deadlines, and track your team's progress."
          message="No tasks found. Ready to get to work? Create your first task to get started."
        >
          <CreateTaskButton setAddTask={setAddTask} />
        </EmptyState>
      ) : (
        <>
          <SearchInput
            handleChange={handleChange}
            query={query}
            setAddTask={setAddTask}
          />
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
      {addTask && <AddTask remove={() => setAddTask(false)} />}
    </article>
  );
};

const SearchInput = ({ handleChange, query, setAddTask }) => {
  const { response } = useContext(DragAndDropContext);

  return (
    <>
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

        <CreateTaskButton setAddTask={setAddTask} />

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

const CreateTaskButton = ({ setAddTask }) => {
  return (
    <button
      type="button"
      className={`button primary flex gap2 ${styles.create_btn}`}
      onClick={() => setAddTask(true)}
    >
      <FaPlus />
      <span>Create</span>
    </button>
  );
};

export default Tasks;
