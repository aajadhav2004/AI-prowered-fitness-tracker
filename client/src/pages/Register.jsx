import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    age: "",
    activityLevel: "Moderately Active",
    injuries: "",
  });

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      alert("Registered successfully! Please log in.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT IMAGE */}
      <div
        className="w-full lg:w-1/2 h-64 lg:h-auto bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop)",
        }}
      >
        {/* Dark overlay for mobile */}
        <div className="absolute inset-0 bg-black/30 lg:hidden"></div>

        {/* Logo for mobile */}
        <div className="absolute inset-0 flex flex-col items-center justify-center lg:hidden">
          <img
            src="/logo512.png"
            alt="IntelliFit Logo"
            className="w-28 h-28 sm:w-36 sm:h-36"
          />
          <span className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            IntelliFit
          </span>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full">

          <h2 className="text-3xl font-bold mb-2 text-center lg:text-left">
            Create New Account 👋
          </h2>

          <p className="text-gray-500 mb-6 text-center lg:text-left">
            Please enter your details to create an account
          </p>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-3">

            {/* Name */}
            <input
              required
              placeholder="Full name"
              className="w-full p-3 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Email */}
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* Password */}
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* Weight + Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                placeholder="Weight (kg)"
                className="p-3 border rounded"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
              <input
                placeholder="Height (cm)"
                className="p-3 border rounded"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </div>

            {/* Age + Activity Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                placeholder="Age"
                className="p-3 border rounded"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />

              <select
                className="p-3 border rounded"
                value={form.activityLevel}
                onChange={(e) =>
                  setForm({ ...form, activityLevel: e.target.value })
                }
              >
                <option>Sedentary</option>
                <option>Lightly Active</option>
                <option>Moderately Active</option>
                <option>Very Active</option>
              </select>
            </div>

            {/* Injuries */}
            <input
              placeholder="Injuries (if any)"
              className="w-full p-3 border rounded"
              value={form.injuries}
              onChange={(e) => setForm({ ...form, injuries: e.target.value })}
            />

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

