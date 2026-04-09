import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { ArrowLeft, Target, PlayCircle, CheckCircle, AlertCircle, Lightbulb, ListOrdered } from "lucide-react";
import { toTitleCase } from "../utils/textUtils";

export default function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  const fetchTutorial = async () => {
    try {
      const response = await api.get("/tutorials");
      const foundTutorial = response.data.tutorials.find((t) => t._id === id);
      setTutorial(foundTutorial);
    } catch (err) {
      console.error("Failed to fetch tutorial:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to convert YouTube URL to embed URL with autoplay
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    let videoId = null;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    // Format: https://www.youtube.com/embed/VIDEO_ID
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    
    // Add autoplay parameter to start video immediately
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  const handleShowImage = () => {
    setShowVideo(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-semibold">Tutorial not found</p>
            <button
              onClick={() => navigate("/tutorials")}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Back to Tutorials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      {/* Main Container - Centered Card */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button Outside Card */}
        <button
          onClick={() => navigate(`/tutorials/category/${tutorial.category}/sub/${tutorial.subCategory}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition mb-6 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Exercises
        </button>

        {/* Single Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{toTitleCase(tutorial.name)}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                <Target className="w-4 h-4" />
                {toTitleCase(tutorial.category)}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                {toTitleCase(tutorial.subCategory)}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8">
            {/* Image/Video Section */}
            <div className="mb-8">
              <div className="relative group">
                {showVideo && tutorial.videoLink ? (
                  // Video Player
                  <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(tutorial.videoLink)}
                      title={tutorial.name}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  // Image
                  <img
                    src={tutorial.imageUrl}
                    alt={tutorial.name}
                    className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                  />
                )}
              </div>
              
              {/* Watch/Show Image Button Below */}
              {tutorial.videoLink && (
                <div className="flex justify-center mt-6 gap-3">
                  {!showVideo ? (
                    <button
                      onClick={handleWatchVideo}
                      className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <PlayCircle className="w-6 h-6" />
                      Watch Video Tutorial
                    </button>
                  ) : (
                    <button
                      onClick={handleShowImage}
                      className="flex items-center gap-3 bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl text-lg font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ArrowLeft className="w-6 h-6" />
                      Show Image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-8"></div>

            {/* Overview Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed ml-13">
                {tutorial.shortDescription}
              </p>
            </div>

            {/* Focus Area Section */}
            <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Focus Area</h2>
              </div>
              
              {/* Focus Area Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {Array.isArray(tutorial.focusArea) ? (
                  tutorial.focusArea.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-blue-100 text-gray-800 px-5 py-2.5 rounded-full text-base font-semibold shadow-sm"
                    >
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-gray-800 px-5 py-2.5 rounded-full text-base font-semibold shadow-sm">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    {tutorial.focusArea}
                  </span>
                )}
              </div>
              
              {/* Focus Area Images - Horizontal Display */}
              {(tutorial.focusAreaFrontImage || tutorial.focusAreaBackImage) && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {tutorial.focusAreaFrontImage && (
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h3 className="text-sm font-bold text-gray-700 mb-2 text-center">Front View</h3>
                      <img
                        src={tutorial.focusAreaFrontImage}
                        alt="Focus Area Front"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {tutorial.focusAreaBackImage && (
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h3 className="text-sm font-bold text-gray-700 mb-2 text-center">Back View</h3>
                      <img
                        src={tutorial.focusAreaBackImage}
                        alt="Focus Area Back"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-8"></div>

            {/* Instructions Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-7 h-7 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Instructions</h2>
                </div>
              </div>
              <div className="ml-15 bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                  {tutorial.instructions}
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Benefits</h2>
                </div>
              </div>
              <div className="ml-15 bg-green-50 rounded-lg p-6">
                <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                  {tutorial.benefits}
                </p>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-7 h-7 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Tips for Proper Form</h2>
                </div>
              </div>
              <div className="ml-15 bg-purple-50 rounded-lg p-6">
                <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                  {tutorial.properFormTips}
                </p>
              </div>
            </div>

            {/* Common Mistakes Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
                  4
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Common Mistakes</h2>
                </div>
              </div>
              <div className="ml-15 bg-red-50 rounded-lg p-6">
                <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                  {tutorial.commonMistakes}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-8"></div>

            {/* Bottom Action */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Ready to continue your workout journey?</h3>
              <button
                onClick={() => navigate(`/tutorials/category/${tutorial.category}/sub/${tutorial.subCategory}`)}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-bold text-base transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore More Exercises
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
