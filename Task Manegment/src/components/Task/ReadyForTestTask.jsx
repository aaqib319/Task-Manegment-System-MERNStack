import React, { useState } from "react";
import Popup from "../other/Popup";

// This component accepts 'tasks' and 'updateTask' as props
const ReadyForTestTask = ({ tasks, updateTask }) => {
  const [popup, setPopup] = useState(null);
  const [failModal, setFailModal] = useState({ show: false, taskId: null, reason: "" });

  const getStatusClasses = (status) => {
    return "bg-teal-600"; // Ready for test color
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
        Ready for Test Tasks
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
              key={task.id || task._id}
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
                    onClick={() => handleAction("View", task.id || task._id)}
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
                    onClick={() =>
                      handleAction("UpdateStatus", task.id || task._id, "qa-failed")
                    }
                    className="p-2 rounded-full bg-rose-600 hover:bg-rose-700 transition-colors duration-200"
                  >
                    {/* X Circle icon SVG */}
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
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    QA Failed
                  </span>
                </div>

                <div className="group relative">
                  <button
                    onClick={() =>
                      handleAction("UpdateStatus", task.id || task._id, "completed")
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

                <div className="group relative">
                  <button
                    onClick={() =>
                      handleFailClick(task.id || task._id)
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
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No tasks ready for test.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReadyForTestTask;