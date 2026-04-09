import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Check, ArrowLeft } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { toTitleCase } from '../utils/textUtils';

const WorkoutCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      alert(err.response?.data?.error || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories`,
        { name: categoryName },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err);
      alert(err.response?.data?.error || 'Failed to add category');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories/${id}`,
        { name: editingName },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      alert(err.response?.data?.error || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(err.response?.data?.error || 'Failed to delete category');
    }
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

      <div className="max-w-4xl mx-auto p-6">
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
            Workout Categories
          </h1>
          <p className="text-gray-600">Manage workout categories for the platform</p>
        </div>

        {/* Add Category Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h2>
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              placeholder="Category name (e.g., Cardio, Strength, Yoga)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              All Categories ({categories.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category._id} className="p-4 hover:bg-gray-50 transition">
                {editingId === category._id ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(category._id)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName('');
                      }}
                      className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{toTitleCase(category.name)}</h3>
                      <p className="text-sm text-gray-500">
                        Added on {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg font-semibold">No categories yet</p>
              <p className="text-sm mt-2">Add your first workout category above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCategories;
