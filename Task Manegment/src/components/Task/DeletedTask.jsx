import React, { useState } from "react";
import Popup from "../other/Popup";
import { useAuth } from "../../context/AuthContext";

const DeletedTask = ({ tasks, updateTask, deleteTask }) => {
  const [popup, setPopup] = useState(null);
  const { isAdmin } = useAuth();

  const handleAction = async (action, taskId) => {
    try {
      if (action === "Restore") {
        await updateTask(taskId, { status: "new" });
        setPopup({ message: "Task restored successfully!", type: "success" });
      } else if (action === "Delete") {
        await deleteTask(taskId);
        setPopup({ message: "Task permanently deleted!", type: "success" });
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
        Deleted Tasks
      </h2>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 py-3 px-4 mb-2 bg-gray-700 rounded-lg font-semibold text-gray-300 border-b border-gray-600 min-w-[900px]">
          <h4 className="flex-1 text-left">Task Title</h4>
          <h4 className="w-32 text-center">Deleted By</h4>
          <h4 className="w-28 text-center">Status</h4>
          <h4 className="w-28 text-center">Priority</h4>
          <h4 className="w-40 text-right">Actions</h4>
        </div>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id || task.id}
              className="flex gap-4 items-center py-4 px-4 mb-3 bg-gray-700 rounded-lg
                         hover:bg-gray-600 transition-colors duration-200 ease-in-out
                         border-b border-gray-600 last:border-b-0 min-w-[900px]"
            >
              <div className="flex-1 text-base font-semibold truncate text-left">
                {task.title}
              </div>

              <div className="w-32 flex justify-center">
                <span className="text-sm font-medium text-gray-200">
                  {task.deletedBy?.name || (typeof task.deletedBy === 'string' ? task.deletedBy : "Unknown")}
                </span>
              </div>

              <div className="w-28 flex justify-center">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-red-600">
                  {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : ''}
                </span>
              </div>

              <div className="w-28 flex justify-center">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-gray-600">
                  {task.priority}
                </span>
              </div>

              <div className="w-40 flex justify-end gap-2">
                <div className="group relative">
                  <button
                    onClick={() => handleAction("Restore", task._id || task.id)}
                    className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200"
                  >
                    {/* Restore/Undo icon SVG */}
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
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                  </button>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Restore Task
                  </span>
                </div>
                {isAdmin && (
                  <div className="group relative">
                    <button
                      onClick={() => handleAction("Delete", task._id || task.id)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
                    >
                      {/* Trash icon SVG */}
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.927a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 18.75a.75.75 0 01-.75-.75V10.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75z"
                        />
                      </svg>
                    </button>
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Delete Permanently
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No deleted tasks to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeletedTask;