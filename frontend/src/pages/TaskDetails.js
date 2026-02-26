import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "../styles/taskdetails.module.css";
import homeStyles from "../styles/home.module.css";

import { AppContext } from "../store/AppContext";
import { tasks } from "../utils/apiendpoints";
import NotFound from "../pages/NotFound";
import ViewTasks from "../components/ViewTasks";
import TaskComments from "../components/TaskComments";
import Response from "../components/Response";

const TaskDetails = () => {
  const { addToast } = useContext(AppContext);

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        setNotFound(false);

        const data = await tasks.get(id);

        if (isMounted) {
          setTask(data.task);
        }
      } catch (error) {
        if (!isMounted) return;

        if (error?.status === 404) {
          setNotFound(true);
        } else {
          addToast({
            type: "error",
            message: error?.message,
          });
          console.log(".....API ERROR.....", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTask();

    return () => {
      isMounted = false;
    };
  }, [id, addToast]);

  if (isLoading) return <Response />;

  if (notFound) return <NotFound />;

  if (!task) return null;

  return (
    <div className={`${styles.container} ${homeStyles.article}`}>
      <ViewTasks task={task} />
      <TaskComments task={task} />
    </div>
  );
};

export default TaskDetails;
