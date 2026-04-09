import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DietBot from "../components/DietBot";
import Footer from "../components/Footer";
import { Loader, Calendar, User as UserIcon, AlertCircle, ChevronDown, ChevronUp, Bot } from "lucide-react";

export default function DailyDiet() {

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  const [userProfile, setUserProfile] = useState(null);
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [generationInfo, setGenerationInfo] = useState(null); // Track generation date and next available date
  const [isDietBotOpen, setIsDietBotOpen] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchCurrentDietPlan(); // Also fetch existing diet plan
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data.user);
    } catch (err) {
      setError("Failed to fetch user profile. Please complete your profile first.");
      console.error("Failed to fetch user profile:", err);
    }
  };

  const fetchCurrentDietPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/diet/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.hasDietPlan) {
        setDiet(response.data);
        
        // Store generation info
        if (response.data.generatedAt && response.data.nextGenerationDate) {
          setGenerationInfo({
            generatedAt: new Date(response.data.generatedAt),
            nextGenerationDate: new Date(response.data.nextGenerationDate),
            message: response.data.message
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch current diet plan:", err);
      // Don't show error - it's okay if there's no existing plan
    }
  };

  const handleGenerateDiet = async () => {
    if (!userProfile) {
      setError("Please complete your profile before generating diet plan.");
      return;
    }

    // Validate required fields
    if (!userProfile.age || !userProfile.gender || !userProfile.weight || !userProfile.height) {
      setError("Please complete your profile (age, gender, weight, height) before generating diet plan.");
      return;
    }

    // Check if already generated this week
    if (generationInfo && generationInfo.message && generationInfo.message.includes("current week")) {
      const nextDate = generationInfo.nextGenerationDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      setError(`Current week's diet plan already generated. You can generate a new diet plan starting ${nextDate}.`);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/diet/generate-weekly`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDiet(response.data);
      
      // Store generation info if available
      if (response.data.generatedAt && response.data.nextGenerationDate) {
        setGenerationInfo({
          generatedAt: new Date(response.data.generatedAt),
          nextGenerationDate: new Date(response.data.nextGenerationDate),
          message: response.data.message
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error generating diet plan. Please try again.");
      console.error("Error generating diet:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Weekly Diet Plan
            </h1>
          </div>
          <p className="text-gray-600 text-lg">AI-powered personalized 7-day meal recommendations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Generation Info Alert */}
        {generationInfo && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-white" />
                <p className="text-white font-bold text-lg">Weekly Diet Plan Status</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-700 text-base mb-4 font-medium">{generationInfo.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📅</span>
                    <p className="text-sm font-semibold text-gray-600">Generated On</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">
                    {generationInfo.generatedAt.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {generationInfo.generatedAt.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔓</span>
                    <p className="text-sm font-semibold text-gray-600">Next Generation Available</p>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {generationInfo.nextGenerationDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Start of next week
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {!diet && (
          <div className="text-center mb-8">
            <button
              onClick={handleGenerateDiet}
              disabled={loading || !userProfile}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Your Weekly Diet...
                </span>
              ) : (
                "🎯 Generate Weekly Diet Plan"
              )}
            </button>
          </div>
        )}

        {/* Diet Plan Results */}
        {diet && (
          <div className="space-y-8">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Daily Calories Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Daily Target</h4>
                  <span className="text-3xl">🔥</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {diet.weeklyTargetCalories}
                </div>
                <p className="text-sm text-gray-500">kcal per day</p>
              </div>

              {/* Protein Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Protein</h4>
                  <span className="text-3xl">💪</span>
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {diet.macros.protein}g
                </div>
                <p className="text-sm text-gray-500">per day</p>
              </div>

              {/* Carbs Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Carbs</h4>
                  <span className="text-3xl">🍚</span>
                </div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {diet.macros.carbs}g
                </div>
                <p className="text-sm text-gray-500">per day</p>
              </div>

              {/* Fats Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-700 font-semibold">Fats</h4>
                  <span className="text-3xl">🥑</span>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {diet.macros.fats}g
                </div>
                <p className="text-sm text-gray-500">per day</p>
              </div>
            </div>

            {/* Meals Section - Weekly Plan */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📅</span> 7-Day Meal Plan
              </h2>

              <div className="space-y-4">
                {diet.weeklyPlan && diet.weeklyPlan.map((dayPlan, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Day Header - Clickable */}
                    <button
                      onClick={() => setExpandedDay(expandedDay === dayPlan.day ? null : dayPlan.day)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-colors bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{dayIndex + 1}</span>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800 text-lg">{dayPlan.day}</p>
                        </div>
                      </div>
                      {expandedDay === dayPlan.day ? (
                        <ChevronUp className="w-6 h-6 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>

                    {/* Day Meals - Expandable */}
                    {expandedDay === dayPlan.day && (
                      <div className="px-6 py-6 bg-white space-y-4 border-t border-gray-200">
                        {Object.entries(dayPlan.meals).map(([mealType, meals]) => (
                          <div key={mealType}>
                            <h3 className="text-lg font-bold capitalize mb-2 text-gray-800 flex items-center gap-2">
                              {mealType === "breakfast" && "🌅"}
                              {mealType === "lunch" && "🍽️"}
                              {mealType === "dinner" && "🌙"}
                              {mealType === "snacks" && "🍎"}
                              {mealType}
                            </h3>

                            {meals.length === 0 ? (
                              <p className="text-gray-500 italic text-sm">No meals available</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {meals.map((meal) => (
                                  <div
                                    key={meal._id}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                                  >
                                    <p className="font-bold text-base text-gray-800 mb-2">{meal.name}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="bg-blue-50 rounded p-1.5">
                                        <p className="text-gray-600 text-xs">Calories</p>
                                        <p className="font-bold text-blue-600">🔥 {meal.calories} kcal</p>
                                      </div>
                                      <div className="bg-red-50 rounded p-1.5">
                                        <p className="text-gray-600 text-xs">Protein</p>
                                        <p className="font-bold text-red-600">💪 {meal.protein}g</p>
                                      </div>
                                      <div className="bg-yellow-50 rounded p-1.5">
                                        <p className="text-gray-600 text-xs">Carbs</p>
                                        <p className="font-bold text-yellow-600">🍚 {meal.carbs}g</p>
                                      </div>
                                      <div className="bg-green-50 rounded p-1.5">
                                        <p className="text-gray-600 text-xs">Fats</p>
                                        <p className="font-bold text-green-600">🥑 {meal.fats}g</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hydration */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-cyan-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💧</span> Hydration Recommendation
                </h3>
                <p className="text-gray-700 leading-relaxed">{diet.hydrationRecommendation}</p>
              </div>

              {/* Important Notes */}
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📝</span> Important Notes
                </h3>
                <p className="text-gray-700 leading-relaxed">{diet.importantNotes}</p>
              </div>
            </div>

            {/* Regenerate Button */}
            <div className="text-center">
              <button
                onClick={handleGenerateDiet}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "🔄 Generate Diet Plan"
                )}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Diet Bot Floating Button */}
      <button
        onClick={() => setIsDietBotOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-40 group"
        title="Diet Bot - Ask nutrition questions"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          AI
        </span>
      </button>

      {/* Diet Bot Chatbot */}
      <DietBot isOpen={isDietBotOpen} onClose={() => setIsDietBotOpen(false)} />
      
      <Footer />
    </div>
  );
}