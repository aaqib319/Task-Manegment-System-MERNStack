// src/components/Task/AcceptTask.jsx
import React, { useState } from "react";
import Popup from "../other/Popup";

// This component accepts 'tasks' and 'updateTask' as props
const AcceptTask = ({ tasks, updateTask }) => {
  const [popup, setPopup] = useState(null);
  const [failModal, setFailModal] = useState({ show: false, taskId: null, reason: "" });

  const getStatusClasses = (status) => {
    // ... (rest of the function is unchanged)
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-indigo-600";
      case "in-progress":
        return "bg-purple-600";
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
        Accepted Tasks
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

              {/* Admin Actions for Accepted Tasks */}
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
                {(task.status.toLowerCase() === "accepted" ||
                  task.status.toLowerCase() === "in-progress") && (
                  <button
                    onClick={() =>
                      handleAction("UpdateStatus", task.id, "ready-for-test")
                    }
                    className="p-2 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                    title="Ready for Test"
                  >
                    {/* Beaker icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </button>
                )}
                {task.status.toLowerCase() !== "completed" &&
                  task.status.toLowerCase() !== "failed" && (
                    <button
                      onClick={() =>
                        handleFailClick(task.id)
                      }
                      className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                      title="Mark Failed"
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
                  )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No accepted tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default AcceptTask;
