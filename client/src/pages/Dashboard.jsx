import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { setAuthToken } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddSmall from "../components/AddSmall";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [daily, setDaily] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  // Convert to India's date (YYYY-MM-DD)
  const getTodayIST = () => {
    return new Date().toLocaleString("en-CA", { timeZone: "Asia/Kolkata" }).split(",")[0];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    refreshDaily();
    fetchWeekly();
  }, []);

  const refreshDaily = async () => {
    try {
      const today = getTodayIST();

      const p = await api.get("/profile");
      setProfile(p.data.user);

      const d = await api.get(`/daily?date=${today}`);
      setDaily(d.data.daily);

      const w = await api.get(`/workouts?date=${today}`);
      setWorkouts(w.data.workouts);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWeekly = async () => {
    try {
      const resp = await api.get("/weekly");

      const chartArray = resp.data.weekly.map((item) => {
        const parts = item.date.split("-");
        return {
          day: parts[2], // last two digits only
          kcal: item.totalCalories,
        };
      });

      setWeeklyData(chartArray);
    } catch (err) {
      console.error("Failed to fetch weekly", err);
      setWeeklyData([]);
    }
  };

  const arr = [
    "Nice! had a great session",
    "Wow! great workout",
    "Keep it up!",
    "You're doing great!",
    "You're on fire!",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="card">
            <h4 className="text-blue-600 font-semibold">Calories Burned</h4>
            <div className="text-3xl font-bold">
              {daily?.totalCaloriesBurned || 0} kcal
            </div>
            <div className="text-sm text-gray-500">
              Total calories burned today
            </div>
          </div>

          <div className="card">
            <h4 className="text-blue-600 font-semibold">Workouts</h4>
            <div className="text-3xl font-bold">
              {daily?.totalWorkouts || 0}
            </div>
            <div className="text-sm text-gray-500">
              Total number of workouts today
            </div>
          </div>

          <div className="card">
            <h4 className="text-blue-600 font-semibold">Average Calories</h4>
            <div className="text-3xl font-bold">
              {workouts.length
                ? Math.round(
                    workouts.reduce((sum, w) => sum + (w.calories || 0), 0) /
                      workouts.length
                  )
                : 0}{" "}
              kcal
            </div>
            <div className="text-sm text-gray-500">
              Average calories burned per workout
            </div>
          </div>
        </div>

        {/* WEEKLY GRAPH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="card md:col-span-2">
            <h4 className="text-blue-600 font-semibold mb-2">
              Weekly Calories Burned
            </h4>

            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData.length ? weeklyData : [{ day: 0, kcal: 0 }]}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="kcal" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ADD WORKOUT */}
          <div className="card">
            <h4 className="text-blue-600 font-semibold">Add New Workout</h4>
            <AddSmall
              setWorkouts={setWorkouts}
              refreshDaily={refreshDaily}
              fetchWeekly={fetchWeekly}
            />
          </div>
        </div>

        {/* TODAY WORKOUTS */}
        <h3 className="mt-8 text-xl font-semibold">Today's Workouts</h3>

        {workouts.length === 0 && (
          <div className="text-gray-300 text-2xl font-semibold text-center mt-8">
            Track. Improve. Repeat.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {workouts.map((w) => (
            <div key={w._id} className="card">
              <div className="text-sm text-blue-600">
                #{w.category || "General"}
              </div>
              <h4 className="text-xl font-semibold">{w.name}</h4>

              <div className="text-gray-600">
                Note: {w.notes || arr[Math.floor(Math.random() * arr.length)]}
              </div>

              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <div>🏋 {w.sets} Sets</div>
                <div>💪 {w.reps} Reps</div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <div>⏱️ {w.duration} min</div>
                <div>🔥 {w.calories} kcal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
