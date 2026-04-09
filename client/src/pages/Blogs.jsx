import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/blogs"); // Make sure your API returns: { blogs: [...] }
        if (response.data.blogs) {
          setBlogs(response.data.blogs);
        } else {
          console.warn("No blogs found in API response");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(blogs);

  const openBlog = (url) => {
    if (!url || url.trim() === "") {
      console.warn("Blog URL missing");
      return;
    }
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Latest Blogs</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b.id || b._id}
                onClick={() => openBlog(b.url)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 cursor-pointer border border-gray-200 hover:border-gray-300"
              >
                {/* Blog image */}
                {b.image_url && (
                  <img
                    src={b.image_url}
                    className="w-full h-40 object-cover rounded-md"
                    alt={b.title}
                  />
                )}

                {/* Blog content */}
                <div className="mt-3">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {b.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {b.author} • {new Date(b.date).toLocaleDateString()}
                  </p>

                  <p className="mt-3 text-gray-700 text-sm line-clamp-3">
                    {b.content}
                  </p>

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      openBlog(b.url);
                    }}
                    className="mt-4 inline-block text-blue-600 font-medium text-sm hover:underline"
                  >
                    Read More →
                  </span>
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
