import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { Calendar, TrendingUp, Activity, Flame, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

// Print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-content, .print-content * {
      visibility: visible;
    }
    .print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
  }
`;

export default function WorkoutReport() {
  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({ total: 0, avg: 0, workouts: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, avg: 0, workouts: 0 });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  const weeklyReportRef = useRef();
  const monthlyReportRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, weeklyRes, monthlyRes] = await Promise.all([
        api.get("/profile"),
        api.get("/weekly"),
        api.get("/monthly"),
      ]);

      setProfile(profileRes.data.user);

      // Process weekly data
      const weeklyChart = weeklyRes.data.weekly.map((item) => {
        const date = new Date(item.date);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return {
          day: dayNames[date.getDay()],
          date: item.date,
          calories: item.totalCalories,
          workouts: item.workouts || 0,
        };
      });
      setWeeklyData(weeklyChart);

      const weeklyTotal = weeklyChart.reduce((sum, item) => sum + item.calories, 0);
      const weeklyWorkouts = weeklyChart.reduce((sum, item) => sum + item.workouts, 0);
      setWeeklyStats({
        total: weeklyTotal,
        avg: Math.round(weeklyTotal / 7),
        workouts: weeklyWorkouts,
      });

      // Process monthly data
      const monthlyChart = monthlyRes.data.monthly.map((item) => {
        const parts = item.date.split("-");
        const day = parseInt(parts[2]);
        return {
          week: `Week ${Math.ceil(day / 7)}`,
          date: item.date,
          calories: item.totalCalories,
          workouts: item.workouts || 0,
        };
      });
      setMonthlyData(monthlyChart);

      const monthlyTotal = monthlyChart.reduce((sum, item) => sum + item.calories, 0);
      const monthlyWorkouts = monthlyChart.reduce((sum, item) => sum + item.workouts, 0);
      setMonthlyStats({
        total: monthlyTotal,
        avg: Math.round(monthlyTotal / 30),
        workouts: monthlyWorkouts,
      });
    } catch (err) {
      console.error("Failed to fetch report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintWeekly = useReactToPrint({
    contentRef: weeklyReportRef,
    documentTitle: `Weekly_Workout_Report_${new Date().toLocaleDateString()}`,
  });

  const handlePrintMonthly = useReactToPrint({
    contentRef: monthlyReportRef,
    documentTitle: `Monthly_Workout_Report_${new Date().toLocaleDateString()}`,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <style>{printStyles}</style>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Workout Reports
          </h1>
          <p className="text-gray-600">Track and analyze your workout performance</p>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 no-print">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "weekly"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <Calendar className="w-5 h-5" />
            Weekly Report
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "monthly"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Monthly Report
          </button>
        </div>

        {/* WEEKLY REPORT */}
        {activeTab === "weekly" && (
          <div>
            {/* Action Button */}
            <div className="flex gap-3 mb-6 no-print">
              <button
                onClick={handlePrintWeekly}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
            </div>

            {/* Report Content */}
            <div ref={weeklyReportRef} className="print-content bg-white rounded-xl shadow-md p-8">
              {/* Report Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Weekly Workout Report</h2>
                <p className="text-gray-600">Report Date: {new Date().toLocaleDateString()}</p>
                {profile && (
                  <p className="text-gray-600">User: {profile.name}</p>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-6 h-6 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Total Calories</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{weeklyStats.total}</p>
                  <p className="text-sm text-gray-600 mt-1">kcal burned this week</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Total Workouts</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{weeklyStats.workouts}</p>
                  <p className="text-sm text-gray-600 mt-1">workouts completed</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Daily Average</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{weeklyStats.avg}</p>
                  <p className="text-sm text-gray-600 mt-1">kcal per day</p>
                </div>
              </div>

              {/* Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="calories" fill="#3b82f6" name="Calories Burned" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Calories Burned</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Workouts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-800">{item.day}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">{item.calories} kcal</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-800">{item.workouts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MONTHLY REPORT */}
        {activeTab === "monthly" && (
          <div>
            {/* Action Button */}
            <div className="flex gap-3 mb-6 no-print">
              <button
                onClick={handlePrintMonthly}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
            </div>

            {/* Report Content */}
            <div ref={monthlyReportRef} className="print-content bg-white rounded-xl shadow-md p-8">
              {/* Report Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Monthly Workout Report</h2>
                <p className="text-gray-600">Report Date: {new Date().toLocaleDateString()}</p>
                {profile && (
                  <p className="text-gray-600">User: {profile.name}</p>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-6 h-6 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Total Calories</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{monthlyStats.total}</p>
                  <p className="text-sm text-gray-600 mt-1">kcal burned this month</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Total Workouts</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{monthlyStats.workouts}</p>
                  <p className="text-sm text-gray-600 mt-1">workouts completed</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Daily Average</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{monthlyStats.avg}</p>
                  <p className="text-sm text-gray-600 mt-1">kcal per day</p>
                </div>
              </div>

              {/* Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 5 }}
                      name="Calories Burned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Week</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Range</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Calories Burned</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Workouts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-800">{item.week}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{item.calories} kcal</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-800">{item.workouts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
