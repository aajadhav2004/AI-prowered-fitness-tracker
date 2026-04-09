import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import api, { setAuthToken } from "./api";
import VoiceAssistant from "./components/VoiceAssistant";

// Pages
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutReport from "./pages/WorkoutReport";
import Tutorials from "./pages/Tutorials";
import SubCategoryExercises from "./pages/SubCategoryExercises";
import TutorialDetail from "./pages/TutorialDetail";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotivationScreen from "./pages/MotivationScreen";
import UserInfo from "./pages/UserInfo";
import DailyDiet from "./pages/DailyDiet";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import UserWorkouts from "./pages/UserWorkouts";
import WorkoutCategories from "./pages/WorkoutCategories";
import AddTutorial from "./pages/AddTutorial";
import AddSubCategory from "./pages/AddSubCategory";
import ManageTutorials from "./pages/ManageTutorials";

setAuthToken(localStorage.getItem("token"));

// Private route wrapper
function Private({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Prevent admin from accessing user routes
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

// Admin route wrapper
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Component to conditionally show VoiceAssistant
function VoiceAssistantWrapper() {
  const location = useLocation();
  const publicRoutes = ["/login", "/register", "/motivation"];
  const adminRoutes = ["/admin"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // Don't show voice assistant on public routes or admin routes
  return !isPublicRoute && !isAdminRoute ? <VoiceAssistant /> : null;
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
          path="/workout-report"
          element={
            <Private>
              <WorkoutReport />
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
          path="/tutorials/category/:category/sub/:subCategory"
          element={
            <Private>
              <SubCategoryExercises />
            </Private>
          }
        />
        <Route
          path="/tutorials/:id"
          element={
            <Private>
              <TutorialDetail />
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
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute> } />
        <Route path="/admin/user/:userId/workouts" element={<AdminRoute><UserWorkouts /></AdminRoute> } />
        <Route path="/admin/categories" element={<AdminRoute><WorkoutCategories /></AdminRoute> } />
        <Route path="/admin/sub-categories" element={<AdminRoute><AddSubCategory /></AdminRoute> } />
        <Route path="/admin/tutorials" element={<AdminRoute><AddTutorial /></AdminRoute> } />
        <Route path="/admin/manage-tutorials" element={<AdminRoute><ManageTutorials /></AdminRoute> } />

      </Routes>
      
      {/* Voice Assistant - Only on private routes */}
      <VoiceAssistantWrapper />

    </BrowserRouter>
  );
}
