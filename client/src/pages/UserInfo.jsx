import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const UserInfo = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const getBMIStatus = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi <= 24.9) return "Healthy";
    if (bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = res.data?.user;

      setProfile({
        ...data,
        bmi: calculateBMI(data.height, data.weight),
      });
    } catch (err) {
      console.error(err);
      setMessage("Error fetching user data.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const updated = { ...profile, [e.target.name]: e.target.value };

    if (e.target.name === "height" || e.target.name === "weight") {
      updated.bmi = calculateBMI(updated.height, updated.weight);
    }

    setProfile(updated);
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/user/update",
        profile,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/user/updatePassword",
        passwords,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Password updated!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error updating password.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">

        <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>

        {message && (
          <div className="p-3 mb-4 text-center bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        {/* ---------- Profile Form ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full border p-2 rounded"
              placeholder="Enter full name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
              className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* AGE */}
          <div>
            <label className="block font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleProfileChange}
              className="w-full border p-2 rounded"
              placeholder="Age"
            />
          </div>

          {/* HEIGHT */}
          <div>
            <label className="block font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleProfileChange}
              className="w-full border p-2 rounded"
              placeholder="Height in centimeters"
            />
          </div>

          {/* WEIGHT */}
          <div>
            <label className="block font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleProfileChange}
              className="w-full border p-2 rounded"
              placeholder="Weight in kg"
            />
          </div>

          {/* BMI */}
          <div>
            <label className="block font-medium mb-1">BMI</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profile.bmi}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
              <span
                className={`px-3 py-1 rounded text-white text-sm ${
                  getBMIStatus(profile.bmi) === "Healthy"
                    ? "bg-green-600"
                    : getBMIStatus(profile.bmi) === "Overweight"
                    ? "bg-yellow-500"
                    : getBMIStatus(profile.bmi) === "Obese"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
              >
                {getBMIStatus(profile.bmi)}
              </span>
            </div>
          </div>
        </div>

        {/* UPDATE BUTTON */}
        <button
          onClick={updateProfile}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Profile
        </button>

        {/* -------- Password Section ---------- */}
        <h3 className="text-2xl font-semibold mt-10 mb-4">Change Password</h3>

        <div>
          <label className="block font-medium mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
            placeholder="Enter new password"
          />
        </div>

        <button
          onClick={updatePassword}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Update Password
        </button>

      </div>
    </>
  );
};

export default UserInfo;
