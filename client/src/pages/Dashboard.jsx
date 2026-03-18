import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { setAuthToken } from "../api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Flame, Activity, Target, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [daily, setDaily] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    last7Days: 0,
    last30Days: 0,
    avgDaily: 0,
    totalWorkouts: 0,
  });

  // Convert to India's date (YYYY-MM-DD)
  const getTodayIST = () => {
    return new Date().toLocaleString("en-CA", { timeZone: "Asia/Kolkata" }).split(",")[0];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    refreshDaily();
    fetchWeekly();
    fetchMonthly();
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
        const dayNum = parseInt(parts[2]);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const date = new Date(item.date);
        const dayName = dayNames[date.getDay()];
        
        return {
          day: dayName,
          date: dayNum,
          kcal: item.totalCalories,
        };
      });

      setWeeklyData(chartArray);

      // Calculate last 7 days total
      const last7Total = chartArray.reduce((sum, item) => sum + item.kcal, 0);
      setStats(prev => ({ ...prev, last7Days: last7Total }));
    } catch (err) {
      console.error("Failed to fetch weekly", err);
      setWeeklyData([]);
    }
  };

  const fetchMonthly = async () => {
    try {
      const resp = await api.get("/monthly");

      const chartArray = resp.data.monthly.map((item) => {
        const parts = item.date.split("-");
        return {
          week: `Week ${Math.ceil(parseInt(parts[2]) / 7)}`,
          kcal: item.totalCalories,
        };
      });

      setMonthlyData(chartArray);

      // Calculate last 30 days total
      const last30Total = chartArray.reduce((sum, item) => sum + item.kcal, 0);
      setStats(prev => ({ ...prev, last30Days: last30Total }));
    } catch (err) {
      console.error("Failed to fetch monthly", err);
      setMonthlyData([]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Fitness Dashboard
          </h1>
          <p className="text-gray-600">Track your progress and achieve your goals</p>
        </div>

        {/* TOP STATS - 4 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Calories */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Today's Calories</h4>
              <Flame className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {daily?.totalCaloriesBurned || 0}
            </div>
            <p className="text-sm text-gray-500">kcal burned</p>
          </div>

          {/* Last 7 Days */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Last 7 Days</h4>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats.last7Days}
            </div>
            <p className="text-sm text-gray-500">kcal burned</p>
          </div>

          {/* Last 30 Days */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Last 30 Days</h4>
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats.last30Days}
            </div>
            <p className="text-sm text-gray-500">kcal burned</p>
          </div>

          {/* Today's Workouts */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Today's Workouts</h4>
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {daily?.totalWorkouts || 0}
            </div>
            <p className="text-sm text-gray-500">workouts completed</p>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* WEEKLY CHART */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Weekly Progress</h2>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData.length ? weeklyData : [{ day: "No", kcal: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    formatter={(value) => [`${value} kcal`, "Calories"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kcal" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MONTHLY CHART */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Monthly Overview</h2>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.length ? monthlyData : [{ week: "No", kcal: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    formatter={(value) => [`${value} kcal`, "Calories"]}
                  />
                  <Bar 
                    dataKey="kcal" 
                    fill="#10b981" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TODAY'S WORKOUTS SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Today's Workouts</h2>
          </div>

          {workouts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">💪</div>
              <p className="text-gray-600 text-lg font-semibold">No workouts yet</p>
              <p className="text-gray-500 mt-2">Go to Workouts page to add your first workout</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((w) => (
                <div key={w._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold uppercase">{w.category || "General"}</p>
                      <h3 className="text-xl font-bold text-gray-800 mt-1">{w.name}</h3>
                    </div>
                    <span className="text-2xl">💪</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {w.notes || arr[Math.floor(Math.random() * arr.length)]}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Sets</p>
                      <p className="text-lg font-bold text-blue-600">{w.sets}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Reps</p>
                      <p className="text-lg font-bold text-green-600">{w.reps}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-lg font-bold text-orange-600">{w.duration}m</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Calories</p>
                      <p className="text-lg font-bold text-red-600">{w.calories}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
