// src/context/TaskContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getAllTasks,
  getTasksByUserId,
  createTask,
  updateTaskStatus,
  updateTask as apiUpdateTask,
  deleteTask,
  getAllUsers, // NEW: Import getAllUsers API function
} from "../utils/api";
import { AuthContext } from "./AuthContext";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State for active employees (users)
  const [employees, setEmployees] = useState([]); // Renamed from 'users' for clarity
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState(null);

  const { user: currentUser, isAuthenticated } = useContext(AuthContext);

  // --- Functions to interact with the backend API ---

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let tasksArray = [];
      if (isAuthenticated && currentUser) {
        if (currentUser.role === "admin") {
          const response = await getAllTasks();
          tasksArray = response.data || [];
        } else if (currentUser.role === "employee" && currentUser._id) {
          const response = await getTasksByUserId(currentUser._id);
          tasksArray = response.data || [];
        }
      }
      setAllTasks(tasksArray);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      // Provide more helpful error messages based on error type
      let errorMessage = "Failed to load tasks.";
      if (err.message?.includes('token') || err.message?.includes('authorization') || err.message?.includes('expired')) {
        errorMessage = `${err.message}. Please log out and log in again.`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // NEW: Function to fetch active employees for the dropdown
  const fetchEmployees = useCallback(async () => {
    // Only fetch employees if the current user is an admin and authenticated
    if (!isAuthenticated || currentUser?.role !== "admin") {
      setEmployees([]); // Clear employees if not admin
      return;
    }

    setLoadingEmployees(true);
    setEmployeesError(null);
    try {
      const response = await getAllUsers(); // Call your API function to get all users
      const data = response.data || [];
      // The backend controller already filters for role: 'employee'
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployeesError(`Employees Error: ${err.message}` || "Failed to load employees.");
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, [isAuthenticated, currentUser]); // Depend on auth status and current user for re-fetch

  // Trigger fetchTasks and fetchEmployees when component mounts or dependencies change
  useEffect(() => {
    fetchTasks();
    fetchEmployees(); // Call new fetchEmployees function
  }, [fetchTasks, fetchEmployees]); // Add fetchEmployees to dependencies

  const addTask = async (newTaskData) => {
    try {
      const response = await createTask(newTaskData);
      // setAllTasks((prevTasks) => [...prevTasks, response.task]); // Removed, fetchTasks will re-populate
      fetchTasks(); // Re-fetch all tasks to ensure correct state and filtering
      return response.task;
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await apiUpdateTask(taskId, updates);
      // Re-fetch tasks to refresh state
      fetchTasks();
      return response.data;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setAllTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  // --- Filtering logic within context for various components ---
  const newTasks = allTasks.filter(
    (task) => task.status === "new" || task.status === "pending"
  );
  const acceptedTasks = allTasks.filter(
    (task) => task.status === "accepted" || task.status === "in-progress"
  );
  const readyForTestTasks = allTasks.filter(
    (task) => task.status === "ready-for-test"
  );
  const qaFailedTasks = allTasks.filter(
    (task) => task.status === "qa-failed"
  );
  const completedTasks = allTasks.filter((task) => task.status === "completed");
  const failedTasks = allTasks.filter((task) => task.status === "failed");
  const rejectedTasks = allTasks.filter((task) => task.status === "rejected");
  const inProgressTasks = allTasks.filter(
    (task) => task.status === "in-progress"
  );
  const deletedTasks = allTasks.filter((task) => task.status === "deleted");

  const value = {
    tasks: allTasks,
    isLoadingTasks: loading,
    taskError: error,

    newTasks,
    acceptedTasks,
    readyForTestTasks,
    qaFailedTasks,
    completedTasks,
    failedTasks,
    rejectedTasks,
    inProgressTasks,
    deletedTasks,

    fetchTasks,
    addTask,
    updateTask,
    deleteTask: removeTask,

    // NEW: Expose employees data and loading/error states
    users: employees, // Provide the filtered employee list
    isLoadingUsers: loadingEmployees,
    usersError: employeesError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
