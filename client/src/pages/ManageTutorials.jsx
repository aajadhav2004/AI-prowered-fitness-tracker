import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ArrowLeft, Edit2, Eye, X } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { toTitleCase } from '../utils/textUtils';

const ManageTutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchTutorials();
    fetchCategories();
  }, []);

  const fetchTutorials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTutorials(response.data.tutorials);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      alert(err.response?.data?.error || 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/user/categories`
      );
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredTutorials = activeTab === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.category === activeTab);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Tutorial deleted successfully!');
      fetchTutorials();
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      alert(err.response?.data?.error || 'Failed to delete tutorial');
    }
  };

  const handleEdit = (tutorial) => {
    // Navigate to AddTutorial page with tutorial data in state
    navigate('/admin/tutorials', { state: { tutorial } });
  };

  const openImageModal = (imageUrl, name) => {
    setImageModal({ isOpen: true, imageUrl, name });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: '', name: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manage Tutorials
          </h1>
          <p className="text-gray-600">View, edit, and delete workout tutorials</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'All'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveTab(cat.name)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === cat.name
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tutorials Table */}
        {filteredTutorials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg font-semibold">No tutorials yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first tutorial from the "Add Tutorials" page</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Exercise Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Sub-Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Short Description
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTutorials.map((tutorial) => (
                    <tr key={tutorial._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <img
                          src={tutorial.imageUrl}
                          alt={tutorial.name}
                          onClick={() => openImageModal(tutorial.imageUrl, tutorial.name)}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                          title="Click to view full size"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{toTitleCase(tutorial.name)}</div>
                        <div className="text-xs text-gray-500">
                          Focus: {Array.isArray(tutorial.focusArea) 
                            ? tutorial.focusArea.map(toTitleCase).join(', ') 
                            : toTitleCase(tutorial.focusArea)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {toTitleCase(tutorial.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          {toTitleCase(tutorial.subCategory)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs line-clamp-2">
                          {tutorial.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(tutorial)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tutorial._id, tutorial.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image Title */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <h3 className="text-xl font-bold">{imageModal.name}</h3>
            </div>
            
            {/* Image */}
            <div className="p-4">
              <img
                src={imageModal.imageUrl}
                alt={imageModal.name}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTutorials;
