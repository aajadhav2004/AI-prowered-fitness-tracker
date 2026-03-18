import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Trophy, Medal, Award, Flame, TrendingUp, Users, Loader } from "lucide-react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      console.log("Fetching leaderboard from:", `${API_BASE_URL}/user/leaderboard`);
      
      const response = await axios.get(`${API_BASE_URL}/user/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Leaderboard response:", response.data);
      
      setLeaderboard(response.data.leaderboard || []);
      setCurrentUser(response.data.currentUser);
      setTotalUsers(response.data.totalUsers || 0);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.error || error.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-orange-600" />;
    return <span className="text-2xl font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-700 text-lg">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Fitness Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Compete with others and track your progress</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-semibold">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Total Athletes</h4>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600">{totalUsers}</div>
          </div>

          {/* Your Rank */}
          {currentUser && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Your Rank</h4>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-4xl font-bold text-green-600">#{currentUser.rank}</div>
              </div>

              {/* Your Calories */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Your Calories</h4>
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-orange-600">
                  {currentUser.totalCalories.toLocaleString()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Top 3 Champions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="md:order-1 order-2">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-4">
                    <Medal className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-700 mb-2">2nd</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{leaderboard[1].name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{leaderboard[1].totalCalories.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{leaderboard[1].totalWorkouts} workouts</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="md:order-2 order-1">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl shadow-2xl p-8 text-center transform md:scale-110 hover:scale-115 transition-transform relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      CHAMPION
                    </div>
                  </div>
                  <div className="flex justify-center mb-4 mt-2">
                    <Trophy className="w-20 h-20 text-yellow-600" />
                  </div>
                  <div className="text-4xl font-bold text-yellow-700 mb-2">1st</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{leaderboard[0].name}</h3>
                  <div className="flex items-center justify-center gap-2 text-yellow-700">
                    <Flame className="w-6 h-6" />
                    <span className="text-3xl font-bold">{leaderboard[0].totalCalories.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{leaderboard[0].totalWorkouts} workouts</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 order-3">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-4">
                    <Award className="w-16 h-16 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-700 mb-2">3rd</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{leaderboard[2].name}</h3>
                  <div className="flex items-center justify-center gap-2 text-orange-600">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{leaderboard[2].totalCalories.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{leaderboard[2].totalWorkouts} workouts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Calories</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Workouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((user) => (
                  <tr
                    key={user.userId}
                    className={`hover:bg-gray-50 transition-colors ${
                      user.isCurrentUser ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.rank <= 3 ? (
                          getRankIcon(user.rank)
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankBadgeColor(user.rank)} flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{user.rank}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${user.isCurrentUser ? "text-blue-600" : "text-gray-800"}`}>
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-gray-800">
                          {user.totalCalories.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">kcal</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-semibold">{user.totalWorkouts}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h3>
            <p className="text-gray-600">Start working out to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
