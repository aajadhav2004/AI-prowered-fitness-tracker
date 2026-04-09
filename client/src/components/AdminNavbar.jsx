import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";

export default function AdminNavbar() {
  const nav = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium 
     ${location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
    `;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left Section - Logo and Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo512.png" className="h-10 w-10" alt="logo" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">IntelliFit</span>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ADMIN
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex space-x-4">
            <Link to="/admin/categories" className={linkClass("/admin/categories")}>Workout Categories</Link>
            <Link to="/admin/sub-categories" className={linkClass("/admin/sub-categories")}>Sub-Categories</Link>
            <Link to="/admin/tutorials" className={linkClass("/admin/tutorials")}>Add Tutorials</Link>
            <Link to="/admin/manage-tutorials" className={linkClass("/admin/manage-tutorials")}>Manage Tutorials</Link>
          </nav>
        </div>

        {/* Desktop Right Section - Logout */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
