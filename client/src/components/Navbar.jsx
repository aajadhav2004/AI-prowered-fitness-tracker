import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icon library (install: npm i lucide-react)

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
          <Link to='/userinfo' className={linkClass("/userinfo")}>Profile</Link>
        </nav>

        {/* Desktop Logout */}
        <button onClick={logout} className="hidden md:block text-blue-600 font-medium">
          Logout
        </button>

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

          <button
            onClick={logout}
            className="w-full text-left py-2 px-3 rounded-md text-blue-600 text-center mx-auto hover:bg-gray-100 mt-2"
          >
            Logout
          </button>
         <button
          onClick={() => {
            setOpen(false);
            nav("/userinfo");
          }}
          className="block w-full py-2 px-3 rounded-md text-gray-700 text-center mx-auto hover:bg-gray-100"
        >
          Profile
        </button>


        </div>
      )}

    </div>
  );
}
