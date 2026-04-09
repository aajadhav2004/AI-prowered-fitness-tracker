import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { ArrowLeft } from "lucide-react";
import { toTitleCase } from "../utils/textUtils";

export default function SubCategoryExercises() {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, [category, subCategory]);

  const fetchTutorials = async () => {
    try {
      const response = await api.get("/tutorials");
      const filtered = response.data.tutorials.filter(
        (t) => t.category === category && t.subCategory === subCategory
      );
      setTutorials(filtered);
    } catch (err) {
      console.error("Failed to fetch tutorials:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tutorials")}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Categories
        </button>

        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <span>{toTitleCase(category)}</span>
            <span>→</span>
            <span className="font-semibold text-gray-800">{toTitleCase(subCategory)}</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            {toTitleCase(subCategory)} Exercises
          </h1>
          <p className="text-gray-600">Choose an exercise to view details</p>
        </div>

        {/* Exercise Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading exercises...</p>
          </div>
        ) : tutorials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg font-semibold">No exercises found</p>
            <p className="text-gray-500 text-sm mt-2">
              No exercises available in {toTitleCase(subCategory)} yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial._id}
                onClick={() => navigate(`/tutorials/${tutorial._id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tutorial.imageUrl}
                    alt={tutorial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {toTitleCase(tutorial.name)}
                  </h3>
                  <div className="mb-2 flex gap-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {toTitleCase(tutorial.category)}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      {toTitleCase(tutorial.subCategory)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {tutorial.shortDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
