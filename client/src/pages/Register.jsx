import { useState } from "react";
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
    gender: "Male",
    activityLevel: "Moderately Active",
    targetWeight: "",
    fitnessGoal: "maintain",
    dietCategory: "non-vegetarian",
    foodAllergies: "",
    preferredCuisine: "",
    injuries: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Convert foodAllergies string to array
      const formData = {
        ...form,
        foodAllergies: form.foodAllergies
          ? form.foodAllergies.split(",").map((item) => item.trim())
          : [],
      };

      await api.post("/register", formData);
      alert("Registered successfully! Please log in.");
      nav("/login");
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.error || err.message || "Registration failed");
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full max-h-screen overflow-y-auto">
          <h2 className="text-3xl font-bold mb-2 text-center lg:text-left">
            Create New Account 👋
          </h2>

          <p className="text-gray-500 mb-6 text-center lg:text-left text-sm">
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
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border rounded pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {/* Weight + Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                required
                placeholder="Weight (kg)"
                type="number"
                className="p-3 border rounded"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
              <input
                required
                placeholder="Height (cm)"
                type="number"
                className="p-3 border rounded"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                required
                placeholder="Age"
                type="number"
                className="p-3 border rounded"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />

              <select
                required
                className="p-3 border rounded"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Target Weight + Activity Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                placeholder="Target Weight (kg)"
                type="number"
                className="p-3 border rounded"
                value={form.targetWeight}
                onChange={(e) =>
                  setForm({ ...form, targetWeight: e.target.value })
                }
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

            {/* Fitness Goal + Diet Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                className="p-3 border rounded"
                value={form.fitnessGoal}
                onChange={(e) =>
                  setForm({ ...form, fitnessGoal: e.target.value })
                }
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain">Maintain</option>
              </select>

              <select
                className="p-3 border rounded"
                value={form.dietCategory}
                onChange={(e) =>
                  setForm({ ...form, dietCategory: e.target.value })
                }
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            {/* Food Allergies */}
            <input
              placeholder="Food Allergies (comma separated, e.g., peanuts, dairy)"
              className="w-full p-3 border rounded text-sm"
              value={form.foodAllergies}
              onChange={(e) =>
                setForm({ ...form, foodAllergies: e.target.value })
              }
            />

            {/* Preferred Cuisine */}
            <input
              placeholder="Preferred Cuisine (optional)"
              className="w-full p-3 border rounded"
              value={form.preferredCuisine}
              onChange={(e) =>
                setForm({ ...form, preferredCuisine: e.target.value })
              }
            />

            {/* Injuries */}
            <input
              placeholder="Injuries (if any)"
              className="w-full p-3 border rounded"
              value={form.injuries}
              onChange={(e) => setForm({ ...form, injuries: e.target.value })}
            />

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold">
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
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
