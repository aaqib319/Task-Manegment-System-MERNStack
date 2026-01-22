// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../other/Header";
import CreateTask from "../other/CreateTask";
import AllTask from "../other/AllTask";

import NewTask from "../Task/NewTask";
import AcceptTask from "../Task/AcceptTask";
import CompleteTask from "../Task/CompleteTask";
import FailedTask from "../Task/FailedTask";
import ReadyForTestTask from "../Task/ReadyForTestTask";
import QAFailedTask from "../Task/QAFailedTask";
import DeletedTask from "../Task/DeletedTask";

import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";

const AdminDashboard = () => {
  // Use Auth context for role checking and user info
  const { user, isAdmin, isAuthenticated } = useAuth();

  // Use Task context to get tasks data and functions
  const {
    tasks, // All tasks fetched by admin role
    isLoadingTasks,
    taskError,
    // fetchTasks, // TaskContext's useEffect handles this now
    newTasks,
    acceptedTasks,
    completedTasks,
    readyForTestTasks,
    qaFailedTasks,
    failedTasks,
    deletedTasks,
    addTask, // Admin-specific action: creating tasks
    updateTask, // Admin/Employee action: updating tasks
    deleteTask, // Admin-specific action: deleting tasks
    users, // <--- NEW: Get the list of users (employees)
    isLoadingUsers, // <--- NEW: Get loading state for users
    usersError, // <--- NEW: Get error state for users
  } = useTasks();

  const [activeTab, setActiveTab] = useState("allTasks");

  // Removed explicit fetchTasks here as TaskContext's useEffect already triggers it
  // and fetchEmployees based on isAuthenticated and isAdmin.
  // You can keep this useEffect if you need to perform actions *after* tasks/users are loaded
  // or based on specific tab changes, but for initial fetch, TaskContext handles it.
  useEffect(() => {
    // Example: If you wanted to refetch *only* when the tab changes to 'createTask'
    // if (activeTab === 'createTask' && !users.length && !isLoadingUsers && !usersError) {
    //   // Potentially call a fetchUsers function if TaskContext exposed it directly
    // }
  }, [activeTab]);

  // Combine loading states for a comprehensive loading screen
  // Show loading if tasks are loading AND no tasks are present yet, OR if users are loading.
  if ((isLoadingTasks && !tasks.length) || isLoadingUsers) {
    return (
      <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center text-white">
        Loading admin dashboard data...
      </div>
    );
  }

  // Combine error states for a comprehensive error screen
  if (taskError || usersError) {
    return (
      <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center text-red-500">
        Error loading data: {taskError || usersError}
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    // Handle unauthorized access: redirect to login or show an error
    return (
      <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center text-red-500">
        Access Denied: You must be an admin to view this page.
        {/* You might also use navigate('/login') here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 p-6 sm:p-10 text-white font-sans">
      <Header />
      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin Task Management ({user?.name || user?.email})
      </h1>

      <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-4">
        <button
          onClick={() => setActiveTab("createTask")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "createTask"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Create Task
        </button>
        <button
          onClick={() => setActiveTab("allTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "allTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveTab("newTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "newTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          New Tasks
        </button>
        <button
          onClick={() => setActiveTab("acceptedTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "acceptedTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Accepted Tasks
        </button>
        <button
          onClick={() => setActiveTab("readyForTestTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "readyForTestTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Ready for Test
        </button>
        <button
          onClick={() => setActiveTab("qaFailedTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "qaFailedTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          QA Failed
        </button>
        <button
          onClick={() => setActiveTab("completedTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "completedTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Completed Tasks
        </button>
        <button
          onClick={() => setActiveTab("failedTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "failedTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Failed Tasks
        </button>
        <button
          onClick={() => setActiveTab("deletedTasks")}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-lg transition-colors duration-200
            ${
              activeTab === "deletedTasks"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          Deleted Tasks
        </button>
      </div>

      <div className="content-area">
        {activeTab === "createTask" && (
          <CreateTask addTask={addTask} users={users} />
        )}{" "}
        {/* <--- Pass the 'users' prop */}
        {activeTab === "allTasks" && (
          <AllTask
            tasks={tasks.filter((task) => task.status !== "deleted")}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
        {activeTab === "newTasks" && (
          <NewTask tasks={newTasks} updateTask={updateTask} />
        )}
        {activeTab === "acceptedTasks" && (
          <AcceptTask tasks={acceptedTasks} updateTask={updateTask} />
        )}
        {activeTab === "readyForTestTasks" && (
          <ReadyForTestTask tasks={readyForTestTasks} updateTask={updateTask} />
        )}
        {activeTab === "qaFailedTasks" && (
          <QAFailedTask tasks={qaFailedTasks} updateTask={updateTask} />
        )}
        {activeTab === "completedTasks" && (
          <CompleteTask tasks={completedTasks} updateTask={updateTask} />
        )}
        {activeTab === "failedTasks" && (
          <FailedTask tasks={failedTasks} updateTask={updateTask} />
        )}
        {activeTab === "deletedTasks" && (
          <DeletedTask tasks={deletedTasks} updateTask={updateTask} deleteTask={deleteTask} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
