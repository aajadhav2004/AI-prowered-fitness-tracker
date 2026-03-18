import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AddSmall from "../components/AddSmall";
import api, { setAuthToken } from "../api";
import { Calendar, Plus, Activity } from "lucide-react";

export default function Workouts() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [workouts, setWorkouts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    fetchWorkouts();
  }, [date]);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get(`/workouts?date=${date}`);
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    }
  };

  const arr = ["Nice! had a great session", "Wow! great workout", "Keep it up!", "You're doing great!", "You're on fire!"];

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            My Workouts
          </h1>
          <p className="text-gray-600">Track and manage your fitness sessions</p>
        </div>

        {/* DATE SELECTOR AND ADD BUTTON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Date Selection Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Select Date</h3>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mb-4">
              {formatDate(date)}
            </p>
          </div>

          {/* Add Workout Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Add Workout</h3>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                showAddForm
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {showAddForm ? "Cancel" : "+ Add New Workout"}
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">Today's Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Workouts:</span>
                <span className="text-2xl font-bold text-orange-600">{workouts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Calories:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {workouts.reduce((sum, w) => sum + (w.calories || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ADD FORM SECTION */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-t-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Workout</h2>
            <AddSmall
              setWorkouts={setWorkouts}
              refreshDaily={() => {}}
              fetchWeekly={() => {}}
            />
          </div>
        )}

        {/* WORKOUTS LIST */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Workouts for {formatDate(date)}
            </h2>
          </div>

          {workouts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-gray-600 text-lg font-semibold">No workouts yet</p>
              <p className="text-gray-500 mt-2">Click "Add New Workout" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((w) => (
                <div
                  key={w._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                >
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

                  <div className="grid grid-cols-2 gap-3">
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
