import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Shield, Menu, X } from "lucide-react";

export default function AdminNavbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-2">
          <Link
            to="/admin/categories"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center hover:bg-gray-100"
          >
            Workout Categories
          </Link>

          <Link
            to="/admin/sub-categories"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center hover:bg-gray-100"
          >
            Sub-Categories
          </Link>

          <Link
            to="/admin/tutorials"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center hover:bg-gray-100"
          >
            Add Tutorials
          </Link>

          <Link
            to="/admin/manage-tutorials"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 rounded-md text-gray-700 text-center hover:bg-gray-100"
          >
            Manage Tutorials
          </Link>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-md text-red-600 text-center hover:bg-gray-100 mt-2 font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
