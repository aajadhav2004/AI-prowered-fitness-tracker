import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      setAuthToken(token);

      nav("/motivation");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT IMAGE (full width on mobile) */}
      <div
        className="w-full lg:w-1/2 h-64 lg:h-auto bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1648995361141-30676a75fd27?q=80&w=688&auto=format&fit=crop)",
        }}
      >
        {/* dark overlay on mobile only */}
        <div className="absolute inset-0 bg-black/30 lg:hidden"></div>

        {/* MOBILE logo */}
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

      {/* RIGHT (FORM) */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6">

        {/* DESKTOP Logo */}
        <div className="hidden lg:flex flex-col items-center mb-8">
          <img
            src="/logo512.png"
            alt="IntelliFit Logo"
            className="w-48 h-48"
          />
          <span className="mt-4 text-5xl font-extrabold text-gray-800">
            IntelliFit
          </span>
        </div>

        {/* FORM BOX */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center lg:text-left mb-1">
            Welcome to IntelliFit 👋
          </h2>

          <p className="text-gray-500 text-center lg:text-left mb-6">
            Please login with your details here
          </p>

          <form onSubmit={submit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center lg:text-left">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
