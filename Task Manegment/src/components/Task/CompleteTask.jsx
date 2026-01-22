// src/components/Task/CompleteTask.jsx
import React, { useState } from "react";
import Popup from "../other/Popup";

// This component accepts 'tasks' and 'updateTask' as props
const CompleteTask = ({ tasks, updateTask }) => {
  const [popup, setPopup] = useState(null);

  const getStatusClasses = (status) => {
    return "bg-lime-600"; // Always completed
  };

  const getPriorityClasses = (priority) => {
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

  const handleAction = async (action, taskId, newStatus = null) => {
    try {
      if (action === "UpdateStatus" && newStatus) {
        await updateTask(taskId, { status: newStatus });
        setPopup({
          message: `Task status updated to '${newStatus}'!`,
          type: "success",
        });
      } else if (action === "View") {
        const task = tasks.find((t) => t.id === taskId || t._id === taskId);
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
        Completed Tasks
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

              <div className="col-span-full md:col-auto flex justify-center md:justify-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getPriorityClasses(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Admin Actions for Completed Tasks (e.g., just view, or re-open) */}
              <div className="w-40 flex justify-end gap-2">
                <button
                  onClick={() => handleAction("View", task.id)}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                  title="View Details"
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
                {/* Admin might have option to re-open a completed task, for example */}
                {/* <button
                    onClick={() => handleAction("UpdateStatus", task.id, "in progress")}
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
                    title="Re-open Task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.181m0-2.91v-.001M15.025 2.409l4.269 4.269m-4.269 4.269V11.25m0 0h4.992m-4.993 0l3.181 3.181m0-2.91v-.001" />
                    </svg>
                </button> */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No completed tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompleteTask;
