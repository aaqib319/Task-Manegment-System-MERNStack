// src/components/other/Header.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext"; // Corrected path to AuthContext
import { useNavigate, Link } from "react-router-dom"; // Assuming you use React Router

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-gray-800 border-b border-gray-700 rounded-lg shadow-md mb-8">
      <h1 className="text-3xl font-bold text-emerald-400">TaskFlow</h1>
      <nav>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-lg">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
