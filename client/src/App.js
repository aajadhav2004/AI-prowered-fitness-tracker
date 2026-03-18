import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import api, { setAuthToken } from "./api";
import VoiceAssistant from "./components/VoiceAssistant";

// Pages
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotivationScreen from "./pages/MotivationScreen";
import UserInfo from "./pages/UserInfo";
import DailyDiet from "./pages/DailyDiet";
import Leaderboard from "./pages/Leaderboard";

setAuthToken(localStorage.getItem("token"));

// Private route wrapper
function Private({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Component to conditionally show VoiceAssistant
function VoiceAssistantWrapper() {
  const location = useLocation();
  const publicRoutes = ["/login", "/register", "/motivation"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  return !isPublicRoute ? <VoiceAssistant /> : null;
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
        <Route path="/diet" element={<Private><DailyDiet /></Private> } />
        <Route path="/leaderboard" element={<Private><Leaderboard /></Private> } />

      </Routes>
      
      {/* Voice Assistant - Only on private routes */}
      <VoiceAssistantWrapper />

    </BrowserRouter>
  );
}
