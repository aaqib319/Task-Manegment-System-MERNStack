// src/components/other/AllTask.jsx
import React, { useState, useRef, useEffect } from "react";
import Popup from "./Popup";

// This component now accepts 'tasks', 'updateTask', and 'deleteTask' as props
const AllTask = ({ tasks, updateTask, deleteTask }) => {
  const [popup, setPopup] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [failModal, setFailModal] = useState({ show: false, taskId: null, reason: "" });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const getStatusClasses = (status) => {
    // ... (rest of the function is unchanged)
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-600";
      case "new":
        return "bg-blue-600";
      case "accepted":
        return "bg-indigo-600";
      case "in-progress":
        return "bg-purple-600";
      case "completed":
        return "bg-lime-600";
      case "failed":
        return "bg-red-600";
      case "rejected":
        return "bg-orange-600"; // Added rejected status
      case "ready-for-test":
        return "bg-teal-600";
      case "qa-failed":
        return "bg-rose-600";
      case "deleted":
        return "bg-red-800";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityClasses = (priority) => {
    // ... (rest of the function is unchanged)
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-red-500 text-red-400";
      case "medium":
        return "border-yellow-500 text-yellow-400";
      case "low":
        return "border-green-500 text-green-400";
      default:
        return "border-gray-600 text-gray-300";
    }
  };

  const handleAction = async (action, taskId, data = null) => {
    // These actions directly call the functions passed from TaskContext via AdminDashboard
    try {
      if (action === "Delete") {
        setTaskToDelete(taskId);
      } else if (action === "UpdateStatus" && data) {
        await updateTask(taskId, { status: data });
        setPopup({
          message: `Task status updated to '${data}'!`,
          type: "success",
        });
      } else if (action === "UpdatePriority" && data) {
        await updateTask(taskId, { priority: data });
        setPopup({
          message: `Task priority updated to '${data}'!`,
          type: "success",
        });
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

  const handleFailClick = (taskId) => {
    setFailModal({ show: true, taskId, reason: "" });
  };

  const submitFailure = async () => {
    if (!failModal.reason.trim()) {
      setPopup({ message: "Please provide a reason for failure.", type: "error" });
      return;
    }
    try {
      await updateTask(failModal.taskId, { status: "failed", failedReason: failModal.reason });
      setPopup({ message: "Task marked as failed!", type: "success" });
      setFailModal({ show: false, taskId: null, reason: "" });
    } catch (error) {
      setPopup({ message: `Action failed: ${error.message}`, type: "error" });
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await updateTask(taskToDelete, { status: "deleted" });
        setPopup({ message: "Task moved to deleted tasks!", type: "success" });
      } catch (error) {
        setPopup({ message: `Delete failed: ${error.message}`, type: "error" });
      }
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-white min-h-[500px] flex flex-col">
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
      )}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-600 max-w-sm w-full min-h-[90px]">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to move this task to the Deleted Tasks tab?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {failModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-600 max-w-sm w-full min-h-[50px]">
            <h3 className="text-xl font-bold text-white mb-4">Report Failure</h3>
            <textarea
              className="w-full bg-gray-700 text-white p-2 rounded mb-4 border border-gray-600 focus:border-emerald-500 outline-none"
              rows="4"
              placeholder="Enter reason for failure..."
              value={failModal.reason}
              onChange={(e) => setFailModal({ ...failModal, reason: e.target.value })}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFailModal({ show: false, taskId: null, reason: "" })}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitFailure}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        All Tasks
      </h2>

      {/* Task List - Scrollable Body */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {/* Header for task list */}
        <div className="flex gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600 min-w-[1000px]">
          <h4 className="flex-1 text-left">Task Title</h4>
          <h4 className="w-32 text-center">Assignee</h4>
          <h4 className="w-28 text-center">Category</h4>
          <h4 className="w-28 text-center">Due Date</h4>
          <h4 className="w-28 text-center">Status</h4>
          <h4 className="w-28 text-center">Priority</h4>
          <h4 className="w-40 text-right">Actions</h4>
        </div>

        {tasks && tasks.length > 0 ? ( // Check if tasks array exists and has items
                    tasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                                   hover:bg-gray-600 transition-colors duration-200 ease-in-out
                                   border-b border-gray-600 last:border-b-0 min-w-[1000px]"
                      >
                        {/* Task Title */}
                        <div className="flex-1 text-base font-semibold truncate text-left">
                          {task.title}
                        </div>

                        {/* Assignee */}
                        <div className="w-32 flex justify-center">
                          <span className="text-sm font-medium text-gray-200">
                            {task.assignedTo?.name || task.assignedTo || task.assignTo || task.firstName || task.assignee || task.employeeName || task.name || "Unassigned"}
                          </span>
                        </div>
          
                        {/* Category */}
                        <div className="w-28 flex justify-center">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-gray-600">
                            {task.category || "General"}
                          </span>
                        </div>
          
                        {/* Due Date */}
                        <div className="w-28 flex justify-center">
                          <span className="text-xs font-semibold text-gray-300">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
          
                        {/* Status Badge */}
                        <div className="w-28 flex justify-center">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getStatusClasses(
                              task.status
                            )}`}
                          >
                              {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : ''}
                          </span>
                        </div>
          
                        {/* Priority Badge */}
                        <div className="w-28 flex justify-center">
                          <div className="relative inline-block w-32" ref={openDropdownId === task._id ? dropdownRef : null}>
                            {/* Button to show current value and toggle dropdown */}
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === task._id ? null : task._id)}
                              className={`w-full flex items-center justify-between text-xs font-semibold pl-4 pr-2 py-1 rounded-lg bg-gray-700 border-2 outline-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-all duration-200 ${getPriorityClasses(
                                task.priority || "Medium"
                              )}`}
                            >
                              <span>{task.priority || "Medium"}</span>
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </button>

                            {/* Dropdown options */}
                            <div
                              className={`absolute right-0 mt-2 w-full rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-20 transition-all duration-200 ease-in-out transform origin-top-right ${
                                openDropdownId === task._id
                                  ? "opacity-100 scale-100 visible"
                                  : "opacity-0 scale-95 invisible pointer-events-none"
                              }`}
                            >
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                  <div
                                    onClick={() => {
                                      handleAction("UpdatePriority", task._id, "High");
                                      setOpenDropdownId(null);
                                    }}
                                    className="block px-4 py-2 text-sm font-semibold text-red-400 hover:bg-gray-600 cursor-pointer"
                                    role="menuitem"
                                  >
                                    High
                                  </div>
                                  <div
                                    onClick={() => {
                                      handleAction("UpdatePriority", task._id, "Medium");
                                      setOpenDropdownId(null);
                                    }}
                                    className="block px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-600 cursor-pointer"
                                    role="menuitem"
                                  >
                                    Medium
                                  </div>
                                  <div
                                    onClick={() => {
                                      handleAction("UpdatePriority", task._id, "Low");
                                      setOpenDropdownId(null);
                                    }}
                                    className="block px-4 py-2 text-sm font-semibold text-green-400 hover:bg-gray-600 cursor-pointer"
                                    role="menuitem"
                                  >
                                    Low
                                  </div>
                                </div>
                              </div>
                          </div>
                        </div>
          
                        {/* Admin Actions for AllTask */}
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
                          {/* Conditional Admin actions */}
                          {(task.status.toLowerCase() === "new" ||
                            task.status.toLowerCase() === "pending") && (
                            <div className="group relative">
                              <button
                                onClick={() =>
                                  handleAction("UpdateStatus", task._id, "accepted")
                                }
                                className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
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
                          )}
                          {(task.status.toLowerCase() === "accepted" ||
                            task.status.toLowerCase() === "in-progress") && (
                            <div className="group relative">
                              <button
                                onClick={() =>
                                  handleAction("UpdateStatus", task._id, "completed")
                                }
                                className="p-2 rounded-full bg-lime-600 hover:bg-lime-700 transition-colors duration-200"
                              >
                                {/* Checkmark in circle icon SVG */}
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
                                Mark Completed
                              </span>
                            </div>
                          )}
                          {task.status.toLowerCase() !== "completed" &&
                            task.status.toLowerCase() !== "failed" && (
                              <div className="group relative">
                                <button
                                  onClick={() =>
                                    handleFailClick(task._id)
                                  }
                                  className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                                >
                                  {/* Exclamation triangle icon SVG */}
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
                                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.07-3.375L12.72 4.5C12.381 3.829 11.619 3.829 11.28 4.5L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                  </svg>
                                </button>
                                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                  Mark Failed
                                </span>
                              </div>
                            )}
                          <div className="group relative">
                            <button
                              onClick={() => handleAction("Delete", task._id)}
                              className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
                            >
                              {/* Trash can icon SVG */}
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
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.927a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.927a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 18.75a.75.75 0 01-.75-.75V10.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75z"
                                />
                              </svg>
                            </button>
                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              Delete Task
                            </span>
                          </div>
                        </div>
                      </div>
                    ))        ) : (
          <p className="text-center text-gray-400 py-8">No tasks to display.</p>
        )}
      </div>
    </div>
  );
};

export default AllTask;
