import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toTitleCase } from "../utils/textUtils";

export default function Tutorials() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subCategoriesRes] = await Promise.all([
        api.get("/categories"),
        api.get("/sub-categories"),
      ]);
      setCategories(categoriesRes.data.categories);
      setSubCategories(subCategoriesRes.data.subCategories);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories =
    selectedCategory === "All"
      ? subCategories
      : subCategories.filter((sub) => sub.category === selectedCategory);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleSubCategoryClick = (subCategory) => {
    // Navigate to exercises page with category and sub-category
    navigate(`/tutorials/category/${subCategory.category}/sub/${subCategory.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Workout Tutorials
          </h1>
          <p className="text-gray-600">Learn proper form and technique</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              onClick={() => handleCategoryClick("All")}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All ({subCategories.length})
            </button>
            {categories.map((cat) => {
              const count = subCategories.filter((sub) => sub.category === cat.name).length;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {toTitleCase(cat.name)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Category Cards - Always show, never show exercises */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        ) : filteredSubCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg font-semibold">No categories found</p>
            <p className="text-gray-500 text-sm mt-2">
              {selectedCategory === "All"
                ? "No categories available yet"
                : `No categories in ${toTitleCase(selectedCategory)} category`}
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSubCategories.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => handleSubCategoryClick(sub)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={sub.imageUrl}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{toTitleCase(sub.name)}</h4>
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      {toTitleCase(sub.category)}
                    </span>
                    <p className="text-gray-600 text-sm">{sub.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
