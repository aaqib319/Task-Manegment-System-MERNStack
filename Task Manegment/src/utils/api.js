// src/utils/api.js
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE_URL || "";

// Helper function for fetch requests
const fetchData = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Allow overriding headers
  };

  // Add authorization header if a token exists
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // JWTs are typically sent as "Bearer <token>"
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers, // Use the merged headers
    });

    // Read body as text first to safely handle empty or non-JSON responses
    const text = await response.text();

    // Try to parse JSON if there's content
    let parsed;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch (parseErr) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Successful response but invalid JSON; return raw text to avoid crashing
        return text;
      }
    } else {
      // No content in response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {};
    }

    // Handle 401/403 responses - token expired or invalid
    if (response.status === 401 || response.status === 403) {
      // Check if the error is related to token expiration or invalidity
      if (parsed?.expired || parsed?.invalid || 
          (parsed?.error && (
            parsed.error.includes('token') || 
            parsed.error.includes('expired') ||
            parsed.error.includes('authorization')
          ))) {
        // Clear auth data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      
      const errMsg = parsed?.error || parsed?.message || 'Authentication failed';
      throw new Error(errMsg);
    }

    if (!response.ok) {
      const errMsg = parsed && (parsed.error || parsed.message) ? (parsed.error || parsed.message) : `HTTP error! status: ${response.status}`;
      throw new Error(errMsg);
    }

    return parsed;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// --- User API functions (no change needed here, fetchData handles the token) ---
export const loginUser = async (email, password) => {
  return fetchData(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (name, email, password, role) => {
  return fetchData(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
};

// --- Task API functions (these will now automatically include the token) ---
export const getAllTasks = async () => {
  return fetchData(`${API_BASE_URL}/api/tasks`);
};

export const getTasksByUserId = async (userId) => {
  return fetchData(`${API_BASE_URL}/api/tasks/user/${userId}`);
};

export const createTask = async (taskData) => {
  return fetchData(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTaskStatus = async (taskId, newStatus) => {
  // Your current updateTaskStatus expects newStatus as a direct argument.
  // The backend might expect an object like { status: newStatus }.
  // I'm aligning it to send an object to be more robust for future updates.
  return fetchData(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }), // Ensure this matches your backend's expectation
  });
};

// Update arbitrary task fields (priority, assignedTo, title, etc.)
export const updateTask = async (taskId, updates) => {
  return fetchData(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (taskId) => {
  return fetchData(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
  });
};

// NEW: Function to fetch all users (or filtered by role, if backend supports)
export const getAllUsers = async () => {
  // Adjust this endpoint based on your backend.
  // If your backend has a /users endpoint that returns all users, use that.
  // If it supports filtering, e.g., /users?role=employee, use that.
  // For now, assuming a general /users endpoint.
  return fetchData(`${API_BASE_URL}/api/users`);
};

// You'd add other API functions here (e.g., update task details, get single task, etc.)
