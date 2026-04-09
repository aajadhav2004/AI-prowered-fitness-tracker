import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ArrowLeft, Eye } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { toTitleCase } from '../utils/textUtils';

const AddSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDescription: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [subCategoriesRes, categoriesRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/sub-categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      setSubCategories(subCategoriesRes.data.subCategories);
      setCategories(categoriesRes.data.categories);
      if (categoriesRes.data.categories.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categoriesRes.data.categories[0].name }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      alert(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Please drop an image file');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image && !editingId) {
      alert('Please select an image');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('shortDescription', formData.shortDescription);
    
    if (image) {
      data.append('image', image, image.name);
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/sub-categories/${editingId}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/sub-categories`;
      
      const method = editingId ? 'put' : 'post';
      
      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      resetForm();
      fetchData();
      alert(editingId ? 'Sub-category updated!' : 'Sub-category added!');
    } catch (err) {
      console.error('Error saving sub-category:', err);
      alert(err.response?.data?.error || 'Failed to save sub-category');
    }
  };

  const handleEdit = (subCategory) => {
    setEditingId(subCategory._id);
    setFormData({
      name: subCategory.name,
      category: subCategory.category,
      shortDescription: subCategory.shortDescription,
    });
    setImagePreview(subCategory.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sub-category?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/sub-categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert('Sub-category deleted!');
    } catch (err) {
      console.error('Error deleting sub-category:', err);
      alert(err.response?.data?.error || 'Failed to delete sub-category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      shortDescription: '',
    });
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
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

      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Workout Sub-Categories
          </h1>
          <p className="text-gray-600">Create sub-categories under main workout categories</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Sub-Category' : 'Add New Sub-Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Leg Beginner, Chest Advanced"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {toTitleCase(cat.name)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Brief description of this sub-category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category Image * {editingId && '(Leave empty to keep current image)'}
              </label>
              
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Click the X to remove or drag a new image to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        Drag and drop your image here
                      </p>
                      <p className="text-sm text-gray-500 mb-3">or</p>
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition font-medium">
                        <ImageIcon className="w-5 h-5" />
                        <span>Browse Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, GIF, WEBP, AVIF, BMP, SVG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                {editingId ? 'Update Sub-Category' : 'Add Sub-Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Existing Sub-Categories</h2>
          </div>
          
          {subCategories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg font-semibold">No sub-categories added yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first sub-category using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Sub-Category Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Parent Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subCategories.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <img
                          src={sub.imageUrl}
                          alt={sub.name}
                          onClick={() => openImageModal(sub.imageUrl, sub.name)}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md mx-auto"
                          title="Click to view full size"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{toTitleCase(sub.name)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {toTitleCase(sub.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {sub.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
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
          )}
        </div>
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

export default AddSubCategory;
