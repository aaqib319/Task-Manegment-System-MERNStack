// src/components/Task/NewTask.jsx
import React, { useState } from "react";
import Popup from "../other/Popup";

// This component now accepts 'tasks' and 'updateTask' as props
const NewTask = ({ tasks, updateTask }) => {
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
      if (action === "Accept") {
        // Calls the updateTask function from props to change status
        await updateTask(taskId, { status: "accepted" });
        setPopup({ message: "Task accepted successfully!", type: "success" });
      } else if (action === "Reject") {
        // Calls the updateTask function from props to change status
        await updateTask(taskId, { status: "rejected" });
        setPopup({ message: "Task rejected!", type: "success" });
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
        New/Pending Tasks
      </h2>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600 min-w-[900px]">
          <h4 className="flex-1 text-left">Task Title</h4>
          <h4 className="w-32 text-center">Assignee</h4>
          <h4 className="w-28 text-center">Status</h4>
          <h4 className="w-28 text-center">Priority</h4>
          <h4 className="w-40 text-right">Actions</h4>
        </div>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                         hover:bg-gray-600 transition-colors duration-200 ease-in-out
                         border-b border-gray-600 last:border-b-0 min-w-[900px]"
            >
              <div className="flex-1 text-base font-semibold truncate text-left">
                {task.title}
              </div>

              <div className="w-32 flex justify-center">
                <span className="text-sm font-medium text-gray-200">
                  {task.assignedTo?.name || "Unassigned"}
                </span>
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
                    onClick={() => handleAction("Accept", task.id)}
                    className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
                  >
                    {/* Checkmark icon SVG */}
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Accept Task
                  </span>
                </div>
                <div className="group relative">
                  <button
                    onClick={() => handleAction("Reject", task.id)}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
                  >
                    {/* X icon SVG */}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Reject Task
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No new tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewTask;
