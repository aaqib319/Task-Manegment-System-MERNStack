// src/components/other/CreateTask.jsx
import React, { useState } from "react";
import Popup from "./Popup";

// Accept addTask and users as props
const CreateTask = ({ addTask, users }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  // IMPORTANT: assignedTo will now store the user ID
  const [assignedTo, setAssignedTo] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [popup, setPopup] = useState(null);

  const categories = [
    "Development",
    "Design",
    "Marketing",
    "Content",
    "Support",
    "HR",
  ];
  const priorities = ["High", "Medium", "Low"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null);

    if (
      !taskTitle ||
      !dueDate ||
      !assignedTo || // Make sure this is a valid user ID
      !category ||
      !priority ||
      !description
    ) {
      setPopup({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    const newTaskData = {
      title: taskTitle,
      dueDate,
      assignedTo, // This is now the user ID (e.g., MongoDB _id)
      category,
      priority,
      description,
      status: "new", // Default status for newly created tasks (match your backend's expected status strings)
    };

    try {
      await addTask(newTaskData);
      setPopup({ message: "Task created successfully!", type: "success" });
      // Reset form fields after successful submission
      setTaskTitle("");
      setDueDate("");
      setAssignedTo(""); // Reset assignedTo to empty string
      setCategory("");
      setPriority("Medium");
      setDescription("");
    } catch (error) {
      console.error("Failed to create task:", error);
      setPopup({
        message: `Failed to create task: ${error.message || "Unknown error."}`,
        type: "error",
      });
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div
      id="createtask"
      className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-white"
    >
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
      )}
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Create New Task
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
      >
        <div className="md:col-span-1">
          {/* Task Title */}
          <div>
            <label
              htmlFor="taskTitle"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Task Title
            </label>
            <input
              id="taskTitle"
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., Develop new API endpoint"
              className="w-full bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 placeholder-gray-500"
              required
            />
          </div>

          {/* Due Date */}
          <div className="mt-5">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 appearance-none date-input-icon"
              required
            />
          </div>

          {/* Assign To (Dropdown) - Now dynamically populated */}
          <div className="mt-5">
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 custom-select"
              required
            >
              <option value="" disabled>
                Select an employee
              </option>
              {/* Conditional rendering for users */}
              {users && users.length > 0 ? (
                users.map((user) => (
                  // Use user._id or user.id based on your backend's user object structure
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name || user.email}{" "}
                    {/* Display user's name or email */}
                  </option>
                ))
              ) : (
                // Show a loading or no-data message if users are not yet fetched or are empty
                <option value="" disabled>
                  {users === null
                    ? "Loading employees..."
                    : "No employees found"}
                </option>
              )}
            </select>
          </div>

          {/* Category (Dropdown) */}
          <div className="mt-5">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 custom-select"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority (Dropdown) */}
          <div className="mt-5">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 custom-select"
              required
            >
              {priorities.map((prio) => (
                <option key={prio} value={prio}>
                  {prio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column for Description and Button */}
        <div className="md:col-span-1">
          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="8"
              placeholder="Provide a detailed description of the task..."
              className="w-full h-full min-h-[160px] bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 px-4 rounded-lg outline-none text-base transition-all duration-200 placeholder-gray-500 resize-y"
              required
            ></textarea>
          </div>

          {/* Create Task Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-lg text-lg mt-8
                       shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
