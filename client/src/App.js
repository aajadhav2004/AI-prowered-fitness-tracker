import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import api, { setAuthToken } from "./api";

// Pages
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotivationScreen from "./pages/MotivationScreen";
import UserInfo from "./pages/UserInfo";

setAuthToken(localStorage.getItem("token"));

// Private route wrapper
function Private({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// App routes
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/motivation" element={<MotivationScreen />} />
        {/* Private Routes */}
        <Route
          path="/"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route
          path="/workouts"
          element={
            <Private>
              <Workouts />
            </Private>
          }
        />
        <Route
          path="/tutorials"
          element={
            <Private>
              <Tutorials />
            </Private>
          }
        />
        <Route
          path="/blogs"
          element={
            <Private>
              <Blogs />
            </Private>
          }
        />
        <Route path="/userinfo" element={<Private><UserInfo /></Private> } />
        


      </Routes>
      

      

    </BrowserRouter>
  );
}
