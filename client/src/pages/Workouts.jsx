import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { setAuthToken } from "../api";

export default function Workouts() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get(`/workouts?date=${date}`);
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    }
  };

  const arr = ["Nice! had a great session", "Wow! great workout", "Keep it up!", "You're doing great!", "You're on fire!"];
  const randomString = arr[Math.floor(Math.random() * arr.length)];
  

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Today's Workout</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar: Date selection */}
          <div className="w-full md:w-1/4 card border rounded-lg shadow-sm p-4">
            <h4 className="text-blue-600 font-semibold mb-2">Select Date</h4>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            />
            <button
              onClick={fetchWorkouts}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Show
            </button>
          </div>

          {/* Workouts List */}
          <div className="flex-1">
            {workouts.length === 0 ? (
              <p className="text-gray-500 mt-4">No workouts found for this date.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {workouts.map((w) => (
                  <div
                    key={w._id}
                    className="card border rounded-lg shadow-sm p-4 hover:shadow-md transition"
                  >
                    <div className="text-sm text-blue-600 mb-1">
                      #{w.category || "General"}
                    </div>
                    <h4 className="text-xl font-semibold">{w.name}</h4>
                    <div className="text-gray-600">Note: {w.notes || arr[Math.floor(Math.random() * arr.length)]}</div>
                    <div className="flex items-center gap-4 mt-3 text-gray-600">
                      <div>🏋 {w.sets} Sets</div>
                      <div>💪 {w.reps} Reps</div> 
                    </div> 
                    <div className="flex items-center gap-4 mt-3 text-gray-600">
                      
                      <div>⌛ {w.duration} min</div>
                      <div>🔥 {w.calories} kcal</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
