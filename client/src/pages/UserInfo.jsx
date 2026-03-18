import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Edit2, X } from "lucide-react";

const UserInfo = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    targetWeight: "",
    activityLevel: "",
    fitnessGoal: "",
    dietCategory: "",
    foodAllergies: [],
    preferredCuisine: "",
    injuries: "",
    bmi: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [allergiesInput, setAllergiesInput] = useState("");
  const [editAllergiesInput, setEditAllergiesInput] = useState("");

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
      const profileData = {
        ...data,
        bmi: calculateBMI(data.height, data.weight),
      };

      setProfile(profileData);
      setEditData(profileData);

      // Set allergies input
      if (data.foodAllergies && Array.isArray(data.foodAllergies)) {
        setAllergiesInput(data.foodAllergies.join(", "));
        setEditAllergiesInput(data.foodAllergies.join(", "));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching user data.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    const updated = { ...editData, [e.target.name]: e.target.value };

    if (e.target.name === "height" || e.target.name === "weight") {
      updated.bmi = calculateBMI(updated.height, updated.weight);
    }

    setEditData(updated);
  };

  const openEditMode = () => {
    setEditData({ ...profile });
    setEditAllergiesInput(allergiesInput);
    setIsEditing(true);
  };

  const closeEditMode = () => {
    setIsEditing(false);
  };

  const updateProfile = async () => {
    try {
      // Convert allergies string to array
      const updatedProfile = {
        ...editData,
        foodAllergies: editAllergiesInput
          ? editAllergiesInput.split(",").map((item) => item.trim())
          : [],
      };

      await axios.put(
        "http://localhost:8080/api/user/update",
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Profile updated successfully!");
      setIsEditing(false);
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

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">User Profile</h2>
            {!isEditing && (
              <button
                onClick={openEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            )}
            {isEditing && (
              <button
                onClick={closeEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <X size={20} />
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className="p-3 mb-4 bg-blue-100 text-blue-700 rounded-lg">
              {message}
            </div>
          )}

          {/* VIEW MODE */}
          {!isEditing ? (
            <>
              {/* ========== BASIC INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Basic Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Full Name</label>
                    <p className="text-gray-800 p-2">{profile.name}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Email</label>
                    <p className="text-gray-800 p-2">{profile.email}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Age</label>
                    <p className="text-gray-800 p-2">{profile.age}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Gender</label>
                    <p className="text-gray-800 p-2">{profile.gender}</p>
                  </div>
                </div>
              </div>

              {/* ========== PHYSICAL INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Physical Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Height (cm)</label>
                    <p className="text-gray-800 p-2">{profile.height}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Weight (kg)</label>
                    <p className="text-gray-800 p-2">{profile.weight}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Target Weight (kg)</label>
                    <p className="text-gray-800 p-2">{profile.targetWeight}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">BMI</label>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-800 p-2">{profile.bmi}</p>
                      <span
                        className={`px-3 py-1 rounded text-white text-sm whitespace-nowrap ${
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
              </div>

              {/* ========== FITNESS INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Fitness Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Activity Level</label>
                    <p className="text-gray-800 p-2">{profile.activityLevel}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Fitness Goal</label>
                    <p className="text-gray-800 p-2">{profile.fitnessGoal}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1 text-gray-700">Injuries (if any)</label>
                    <p className="text-gray-800 p-2">{profile.injuries || "None"}</p>
                  </div>
                </div>
              </div>

              {/* ========== DIET INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Diet Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Diet Category</label>
                    <p className="text-gray-800 p-2">{profile.dietCategory}</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Preferred Cuisine</label>
                    <p className="text-gray-800 p-2">{profile.preferredCuisine}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1 text-gray-700">Food Allergies</label>
                    <p className="text-gray-800 p-2">{allergiesInput || "None"}</p>
                  </div>
                </div>
              </div>

              {/* ========== PASSWORD SECTION ========== */}
              <div className="card">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Change Password</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <button
                  onClick={updatePassword}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-4"
                >
                  Update Password
                </button>
              </div>
            </>
          ) : (
            <>
              {/* EDIT MODE */}
              {/* ========== BASIC INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Basic Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      readOnly
                      className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Age"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ========== PHYSICAL INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Physical Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={editData.height}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Height in centimeters"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={editData.weight}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Weight in kg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Target Weight (kg)</label>
                    <input
                      type="number"
                      name="targetWeight"
                      value={editData.targetWeight}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Target weight in kg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">BMI</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editData.bmi}
                        readOnly
                        className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                      />
                      <span
                        className={`px-3 py-1 rounded text-white text-sm whitespace-nowrap ${
                          getBMIStatus(editData.bmi) === "Healthy"
                            ? "bg-green-600"
                            : getBMIStatus(editData.bmi) === "Overweight"
                            ? "bg-yellow-500"
                            : getBMIStatus(editData.bmi) === "Obese"
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {getBMIStatus(editData.bmi)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== FITNESS INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Fitness Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Activity Level</label>
                    <select
                      name="activityLevel"
                      value={editData.activityLevel}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Activity Level</option>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Fitness Goal</label>
                    <select
                      name="fitnessGoal"
                      value={editData.fitnessGoal}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Fitness Goal</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="maintain">Maintain</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1 text-gray-700">Injuries (if any)</label>
                    <input
                      type="text"
                      name="injuries"
                      value={editData.injuries}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Describe any injuries"
                    />
                  </div>
                </div>
              </div>

              {/* ========== DIET INFORMATION ========== */}
              <div className="card mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Diet Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Diet Category</label>
                    <select
                      name="dietCategory"
                      value={editData.dietCategory}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Diet Category</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Preferred Cuisine</label>
                    <input
                      type="text"
                      name="preferredCuisine"
                      value={editData.preferredCuisine}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="e.g., Indian, Italian, etc."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1 text-gray-700">
                      Food Allergies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editAllergiesInput}
                      onChange={(e) => setEditAllergiesInput(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="e.g., peanuts, dairy, gluten"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={updateProfile}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-8"
              >
                Save Profile
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserInfo;
