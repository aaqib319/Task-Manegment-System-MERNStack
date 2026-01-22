import React from "react";

const TaskCard = ({ task }) => {
  const getPriorityClasses = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-blue-600 text-white";
      case "in-progress":
        return "bg-purple-600 text-white";
      case "completed":
        return "bg-lime-600 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "accepted":
        return "bg-indigo-600 text-white";
      case "ready-for-test":
        return "bg-teal-600 text-white";
      case "qa-failed":
        return "bg-rose-600 text-white";
      default:
        return "bg-gray-400 text-black";
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-[320px] p-6 rounded-2xl shadow-xl hover:shadow-2xl
                  transform hover:scale-[1.02] transition-all duration-300 ease-in-out
                  bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-700
                 `}
    >
      <div className="flex justify-between items-center mb-4">
        <span
          className={`text-xs font-semibold py-1 px-3 rounded-full ${getPriorityClasses(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        <span
          className={`text-xs font-semibold py-1 px-3 rounded-full ${getStatusClasses(
            task.status
          )}`}
        >
          {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : ''}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-3 leading-tight">{task.title}</h2>
      <p className="text-sm text-gray-300 mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <span>Due: {task.dueDate}</span>
        {task.assignedTo && (
          <span className="bg-gray-600 px-3 py-1 rounded-full text-xs">
            Assigned to: {task.assignedTo?.name || task.assignedTo}
          </span>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <div className="flex-1 group relative">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition duration-200 ease-in-out text-sm">
            View Details
          </button>
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            View Details
          </span>
        </div>
        <div className="flex-1 group relative">
          <button className="w-full bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 rounded-lg transition duration-200 ease-in-out text-sm">
            Mark Complete
          </button>
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            Mark Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
