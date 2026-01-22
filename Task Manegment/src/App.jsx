// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login"; // Corrected path based on your shared code
import Register from "./components/Register/Register"; // Assuming this is your Register component's path

// Import your actual Dashboard components from their correct locations
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";

import { useAuth } from "./context/AuthContext"; // Import useAuth to check auth status

// PrivateRoute component to protect routes based on authentication and roles
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth(); // Correctly destructuring user here

  // Show a loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <p className="text-white text-center min-h-screen flex items-center justify-center bg-gray-950">
        Loading authentication...
      </p>
    );
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user is authenticated but not authorized for this route, redirect to login
    // or to an unauthorized page if you have one
    return <Navigate to="/login" replace />;
  }

  // If authenticated and authorized, render the children components
  return children;
};

function App() {
  // FIX: Destructure 'user' along with isAuthenticated and isLoading from useAuth()
  const { isAuthenticated, isLoading, user } = useAuth(); // Get auth status, loading state, AND user object

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Dashboard Route */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Employee Dashboard Route */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        {/* Root path redirection logic */}
        <Route
          path="/"
          element={
            isLoading ? (
              <p className="text-white text-center min-h-screen flex items-center justify-center bg-gray-950">
                Loading...
              </p> // Show loading while auth status is unknown
            ) : isAuthenticated ? (
              // If authenticated, determine which dashboard to go to based on user's role
              <Navigate
                to={
                  user?.role === "admin" // 'user' is now correctly defined here
                    ? "/admin-dashboard"
                    : "/employee-dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace /> // If not authenticated, go to login
            )
          }
        />

        {/* Fallback for any unmatched routes */}
        <Route
          path="*"
          element={
            <h1 className="text-white text-center min-h-screen flex items-center justify-center bg-gray-950">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
