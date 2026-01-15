import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    (async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error loading blog:", error);
      }
    })();
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6 text-center text-gray-500">
          Loading blog...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium hover:underline mb-4"
        >
          ← Back
        </button>

        {/* Blog Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{blog.title}</h1>

        {/* Author & Date */}
        <p className="text-gray-600 text-sm mb-4">
          By <span className="font-semibold">{blog.author}</span> •{" "}
          {new Date(blog.date).toLocaleDateString()}
        </p>

        {/* Blog Image */}
        {blog.image_url && (
          <img
            src={blog.image_url}
            className="w-full h-64 sm:h-96 object-cover rounded-xl shadow mb-6"
            alt={blog.title}
          />
        )}

        {/* Blog Content */}
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
