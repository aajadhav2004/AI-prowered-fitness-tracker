import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react"; // icon library (install: npm i lucide-react)
import axios from "axios";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium 
     ${location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
    `;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <img src="/logo512.png" className="h-10 w-10" alt="logo" />
          <span className="text-xl font-bold text-gray-800">IntelliFit</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className={linkClass("/")}>Dashboard</Link>
          <Link to="/workouts" className={linkClass("/workouts")}>Workouts</Link>
          <Link to="/tutorials" className={linkClass("/tutorials")}>Tutorials</Link>
          <Link to="/blogs" className={linkClass("/blogs")}>Blogs</Link>
          <Link to="/diet" className={linkClass("/diet")}>Diet Plan</Link>
          <Link to="/leaderboard" className={linkClass("/leaderboard")}>Leaderboard</Link>
          <Link to='/userinfo' className={linkClass("/userinfo")}>Profile</Link>
        </nav>

        {/* Desktop Right Section - User Badge & Logout */}
        <div className="hidden md:flex items-center gap-4">
          {/* User Badge */}
          {userProfile && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">{userProfile.name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>{userProfile.dietCategory === "vegetarian" ? "🥗" : "🍗"}</span>
                  {userProfile.dietCategory === "vegetarian" ? "Vegetarian" : "Non-Veg"}
                </p>
              </div>
            </div>
          )}
          
          <button onClick={logout} className="text-blue-600 font-medium hover:text-blue-700">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 " />}
        </button>
      </div>

      {/* Mobile Menu */}
      
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-2">
          {/* Mobile User Badge */}
          {userProfile && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">{userProfile.name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>{userProfile.dietCategory === "vegetarian" ? "🥗" : "🍗"}</span>
                  {userProfile.dietCategory === "vegetarian" ? "Vegetarian" : "Non-Veg"}
                </p>
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            to="/workouts"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Workouts
          </Link>

          <Link
            to="/tutorials"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Tutorials
          </Link>

          <Link
            to="/blogs"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Blogs
          </Link>

          <Link
            to="/diet"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Diet Plan
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Leaderboard
          </Link>

          <button
            onClick={() => {
              setOpen(false);
              nav("/userinfo");
            }}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
          >
            Profile
          </button>

          <button
            onClick={logout}
            className="w-full text-left py-2 px-3 rounded-md text-blue-600 text-center mx-auto hover:bg-gray-100 mt-2"
          >
            Logout
          </button>
        </div>
      )}

    </div>
  );
}
