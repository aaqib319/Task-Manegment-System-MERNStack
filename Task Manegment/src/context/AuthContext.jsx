// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser } from "../utils/api";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Initialize user from localStorage if exists
  const [user, setUser] = useState(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      const storedToken = localStorage.getItem("authToken");
      if (storedUserData && storedToken) {
        return { ...JSON.parse(storedUserData), token: storedToken };
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials.email, credentials.password);
      const { token, user: userData } = response; // Backend now returns token and user

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser({ ...userData, token }); // Store user data and token in state
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.role
      );
      // After registration, you might want to automatically log them in
      // or redirect to login page. For simplicity, let's just set the user for now.
      const { user: userData } = response; // Assuming backend returns user data after registration
      // If backend also returns a token on register, capture it here too
      // const { token, user: userData } = response;
      setUser(userData); // Set user state (without token if register doesn't provide one)
      // localStorage.setItem("userData", JSON.stringify(userData)); // Optional: store registration data
      // If you want to log in immediately after register:
      // await loginUser(credentials.email, credentials.password); // Call login to get token and set state
      return response; // Return response for navigation
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
      throw err; // Re-throw to be caught by the component
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    setError(null);
  };

  const authContextValue = {
    user,
    isLoading,
    error,
    login,
    register, // Expose register function
    logout,
    isAuthenticated: !!user && !!user.token, // Check if user and token exist
    isAdmin: user && user.role === "admin",
    isEmployee: user && user.role === "employee",
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
