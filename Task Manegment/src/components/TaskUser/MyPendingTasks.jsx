// src/components/TaskUser/MyPendingTasks.jsx
import React, { useState } from "react";
import Popup from "../other/Popup";

// This component now accepts 'tasks' and 'updateTask' as props
const MyPendingTasks = ({ tasks, updateTask }) => {
  const [popup, setPopup] = useState(null);

  const getStatusClasses = (status) => {
    // ... (rest of the function is unchanged)
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-600";
      case "new":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityClasses = (priority) => {
    // ... (rest of the function is unchanged)
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-700";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleAction = async (action, taskId) => {
    try {
      if (action === "Start Task") {
        await updateTask(taskId, { status: "in-progress" });
        setPopup({ message: "Task started!", type: "success" });
      } else if (action === "View") {
        const task = tasks.find((t) => t._id === taskId);
        setPopup({
          message: task ? (
            <div>
              <h3 className="font-bold text-lg mb-2">{task.title}</h3>
              <p className="text-sm text-gray-300">{task.description}</p>
            </div>
          ) : (
            "Task details not found."
          ),
          type: "info",
        });
      }
    } catch (error) {
      setPopup({ message: `Action failed: ${error.message}`, type: "error" });
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-white min-h-[500px] flex flex-col">
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
      )}
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        My Pending Tasks
      </h2>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600 min-w-[800px]">
          <h4 className="flex-1 text-left">Task Title</h4>
          <h4 className="w-28 text-center">Status</h4>
          <h4 className="w-28 text-center">Priority</h4>
          <h4 className="w-40 text-right">Actions</h4>
        </div>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                         hover:bg-gray-600 transition-colors duration-200 ease-in-out
                         border-b border-gray-600 last:border-b-0 min-w-[800px]"
            >
              <div className="flex-1 text-base font-semibold truncate text-left">
                {task.title}
              </div>

              <div className="w-28 flex justify-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getStatusClasses(
                    task.status
                  )}`}
                >
                  {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : ''}
                </span>
              </div>

              <div className="w-28 flex justify-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getPriorityClasses(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="w-40 flex justify-end gap-2">
                <div className="group relative">
                  <button
                    onClick={() => handleAction("View", task._id)}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                  >
                    {/* Eye icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    View Details
                  </span>
                </div>
                <div className="group relative">
                  <button
                    onClick={() => handleAction("Start Task", task._id)}
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
                  >
                    {/* Play icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.359 1.636-.936l10.05 5.654a1.5 1.5 0 010 2.672l-10.05 5.654c-.719.423-1.636-.08-1.636-.936V5.653z"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Start Task
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No pending tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyPendingTasks;
