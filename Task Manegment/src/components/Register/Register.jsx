// src/components/Register/Register.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust path if necessary
import { useNavigate } from "react-router-dom";
import Popup from "../other/Popup";

function Register() {
  const [name, setName] = useState(""); // Add name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default to 'employee'
  const { register, isLoading, error } = useAuth(); // Get register function and state
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (error) {
      setPopup({ message: error, type: "error" });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register({ name, email, password, role });
      // On successful registration, navigate to the login page.
      // The user can then explicitly log in with their new account.
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err); // Log the error for debugging
      // The error state is already handled by AuthContext and will be displayed
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
      )}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-400">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block appearance-none w-full bg-gray-700 border border-gray-600 text-gray-100 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="employee" className="bg-gray-700 text-white">
                  Employee
                </option>
                <option value="admin" className="bg-gray-700 text-white">
                  Admin
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition duration-200 font-medium"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
