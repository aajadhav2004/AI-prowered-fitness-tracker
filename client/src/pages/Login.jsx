import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetError, setResetError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });
      const token = res.data.token;
      const role = res.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setAuthToken(token);

      // Redirect based on role
      if (role === 'admin') {
        nav("/admin");
      } else {
        nav("/motivation");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.error || err.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    try {
      const res = await api.post("/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data.message);
      
      // Close forgot modal and open OTP modal immediately
      setTimeout(() => {
        setShowForgotModal(false);
        setShowOTPModal(true);
        setForgotMessage("");
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    setResetLoading(true);

    try {
      const res = await api.post("/reset-password", {
        email: forgotEmail,
        otp: otp,
        newPassword: newPassword,
      });
      alert(res.data.message);
      closeAllModals();
    } catch (err) {
      setResetError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail("");
    setForgotMessage("");
    setForgotError("");
  };

  const closeAllModals = () => {
    setShowForgotModal(false);
    setShowOTPModal(false);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotMessage("");
    setForgotError("");
    setResetError("");
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center lg:text-left">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="mt-2 text-center lg:text-left">
            <button
              onClick={openForgotModal}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL - Email Input */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative">
              {/* Close button */}
              <button
                onClick={closeAllModals}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl font-bold leading-none transition-colors"
              >
                ×
              </button>

              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🔐</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Forgot Password?
              </h3>
              <p className="text-blue-100">
                Enter your email to receive OTP
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {/* Success Message */}
              {forgotMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <p className="text-green-700 text-sm font-medium flex items-center">
                    <span className="mr-2">✅</span>
                    {forgotMessage}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {forgotError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 text-sm font-medium flex items-center">
                    <span className="mr-2">❌</span>
                    {forgotError}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {forgotLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    onClick={closeAllModals}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP & RESET PASSWORD MODAL */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn my-8">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
              {/* Close button */}
              <button
                onClick={closeAllModals}
                className="absolute top-3 right-3 text-white hover:text-gray-200 text-3xl font-bold leading-none transition-colors"
              >
                ×
              </button>

              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl">🔑</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                Reset Password
              </h3>
              <p className="text-blue-100 text-sm">
                Enter OTP and create new password
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Error Message */}
              {resetError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 text-xs font-medium flex items-center">
                    <span className="mr-2">❌</span>
                    {resetError}
                  </p>
                </div>
              )}

              {/* Info Message */}
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <p className="text-blue-700 text-xs font-medium flex items-center">
                  <span className="mr-2">📧</span>
                  OTP sent to {forgotEmail}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-xl font-mono tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-semibold text-blue-600">⏱️</span> OTP valid for 10 minutes
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowOTPModal(false);
                    setShowForgotModal(true);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setResetError("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs hover:underline"
                >
                  ← Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
