// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Import BrowserRouter from react-router-dom
import { BrowserRouter } from "react-router-dom"; // <--- Add this line

import { TaskProvider } from "./context/TaskContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap your entire application with BrowserRouter */}
    <BrowserRouter>
      {" "}
      {/* <--- Add this */}
      <AuthContextProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthContextProvider>
    </BrowserRouter>{" "}
    {/* <--- Add this */}
  </React.StrictMode>
);
