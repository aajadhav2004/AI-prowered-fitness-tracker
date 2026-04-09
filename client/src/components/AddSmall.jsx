import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import api from "../api";
import WorkoutVoiceAssistant from "./WorkoutVoiceAssistant";
import { toTitleCase } from "../utils/textUtils";

export default function AddSmall({ setWorkouts, refreshDaily, fetchWeekly }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(30);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [notes, setNotes] = useState("");
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
      // Set first category as default if available
      if (response.data.categories.length > 0 && !category) {
        setCategory(response.data.categories[0].name);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Common workout names
  const workoutNames = [
    "Running",
    "Cycling",
    "Swimming",
    "Walking",
    "Jogging",
    "Push-ups",
    "Pull-ups",
    "Squats",
    "Lunges",
    "Plank",
    "Bench Press",
    "Deadlift",
    "Shoulder Press",
    "Bicep Curls",
    "Tricep Dips",
    "Leg Press",
    "Crunches",
    "Burpees",
    "Jump Rope",
    "Mountain Climbers",
    "Yoga",
    "Pilates",
    "Zumba",
    "Boxing",
    "Kickboxing",
    "Rowing",
    "Elliptical",
    "Treadmill",
    "Stair Climbing",
    "HIIT Workout"
  ];

  // Function to get today's date in IST (YYYY-MM-DD)
  const getISTDate = () => {
    return new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  };

  const submit = async (e) => {
    e?.preventDefault();

    const todayIST = getISTDate(); // auto IST date

    // Debug: Log the values being sent
    console.log("=== Submitting Workout ===");
    console.log("Sets:", sets, "Type:", typeof sets);
    console.log("Reps:", reps, "Type:", typeof reps);
    console.log("Duration:", duration, "Type:", typeof duration);

    try {
      const workoutData = {
        name,
        category,
        duration: Number(duration),
        sets: Number(sets),
        reps: Number(reps),
        notes,
        date: todayIST,
      };

      console.log("Workout data being sent:", workoutData);

      const r = await api.post("/addWorkout", workoutData);

      console.log("Workout saved:", r.data.workout);

      setWorkouts((prev) => [r.data.workout, ...prev]);

      // Reset fields
      resetForm();

      // Refresh dashboard
      await refreshDaily();
      await fetchWeekly();

      alert("Workout added!");
    } catch (err) {
      console.error("Error adding workout:", err);
      alert(err.response?.data?.error || "Failed to add workout");
    }
  };

  const resetForm = () => {
    setName("");
    setCategory(categories.length > 0 ? categories[0].name : "");
    setDuration(30);
    setSets(3);
    setReps(12);
    setNotes("");
  };

  const handleVoiceWorkoutSubmit = async (workoutData) => {
    const todayIST = getISTDate();

    try {
      const r = await api.post("/addWorkout", {
        ...workoutData,
        date: todayIST,
      });

      setWorkouts((prev) => [r.data.workout, ...prev]);

      // Refresh dashboard
      await refreshDaily();
      await fetchWeekly();

      // Close voice assistant
      setIsVoiceAssistantOpen(false);
    } catch (err) {
      console.error("Failed to add workout via voice:", err);
      alert(err.response?.data?.error || "Failed to add workout");
    }
  };

  return (
    <>
      <div className="relative pb-2">
        {/* Voice Assistant Button - Floating Top Right */}
        <button
          type="button"
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-200 group shadow-md z-50"
          title="Voice Assistant - Add workout by speaking"
          style={{ marginTop: '-60px' }}
        >
          <Mic className="w-5 h-5 group-hover:animate-pulse" />
        </button>

        <form onSubmit={submit} className="space-y-2">
          {/* Workout Name Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name
            </label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a workout</option>
              {workoutNames.map((workout) => (
                <option key={workout} value={workout}>
                  {workout}
                </option>
              ))}
            </select>
          </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {toTitleCase(cat.name)}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex gap-2">
          Sets:<input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            placeholder="Sets"
            className="w-1/2 p-2 border rounded"
          />
          Reps:<input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            placeholder="Reps"
            className="w-1/2 p-2 border rounded"
          />
        </div>

        Duration :<input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Duration (min)"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Notes"
        ></textarea>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Add Workout
        </button>
      </form>
      </div>

      {/* Voice Assistant Modal */}
      <WorkoutVoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onWorkoutSubmit={handleVoiceWorkoutSubmit}
        workoutNames={workoutNames}
        categories={categories.map(cat => cat.name)}
      />
    </>
  );
}
