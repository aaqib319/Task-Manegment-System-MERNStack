import React from "react";
import TaskCard from "./TaskCard"; // Ensure this path is correct based on where you save TaskCard.jsx
import { useTasks } from "../../context/TaskContext";

const TaskList = () => {
  const { tasks, isLoadingTasks, taskError } = useTasks();

  if (isLoadingTasks) {
    return <p className="text-white">Loading tasks...</p>;
  }

  if (taskError) {
    return <p className="text-red-500">{taskError}</p>;
  }

  return (
    <div
      id="tasklist"
      className="flex items-stretch gap-6 mt-10 pb-6 pr-2 overflow-x-auto custom-scrollbar" // Added custom-scrollbar for a sleeker scrollbar
    >
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
