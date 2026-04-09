import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { toTitleCase } from '../utils/textUtils';

const AddTutorial = () => {
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    shortDescription: '',
    instructions: '',
    benefits: '',
    properFormTips: '',
    commonMistakes: '',
    focusArea: [],
    videoLink: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [focusAreaFrontImage, setFocusAreaFrontImage] = useState(null);
  const [focusAreaFrontImagePreview, setFocusAreaFrontImagePreview] = useState(null);
  const [focusAreaBackImage, setFocusAreaBackImage] = useState(null);
  const [focusAreaBackImagePreview, setFocusAreaBackImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchData();
    
    // Check if tutorial data was passed from ManageTutorials
    if (location.state?.tutorial) {
      const tutorial = location.state.tutorial;
      setEditingId(tutorial._id);
      setFormData({
        name: tutorial.name,
        category: tutorial.category,
        subCategory: tutorial.subCategory || '',
        shortDescription: tutorial.shortDescription,
        instructions: tutorial.instructions || '',
        benefits: tutorial.benefits || '',
        properFormTips: tutorial.properFormTips || '',
        commonMistakes: tutorial.commonMistakes || '',
        focusArea: Array.isArray(tutorial.focusArea) ? tutorial.focusArea : [],
        videoLink: tutorial.videoLink || '',
      });
      setImagePreview(tutorial.imageUrl);
      if (tutorial.focusAreaFrontImage) {
        setFocusAreaFrontImagePreview(tutorial.focusAreaFrontImage);
      }
      if (tutorial.focusAreaBackImage) {
        setFocusAreaBackImagePreview(tutorial.focusAreaBackImage);
      }
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [tutorialsRes, categoriesRes, subCategoriesRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/sub-categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      setTutorials(tutorialsRes.data.tutorials);
      setCategories(categoriesRes.data.categories);
      setSubCategories(subCategoriesRes.data.subCategories);
      
      // If editing, filter sub-categories based on the category
      if (location.state?.tutorial) {
        const tutorial = location.state.tutorial;
        const filtered = subCategoriesRes.data.subCategories.filter(sub => sub.category === tutorial.category);
        setFilteredSubCategories(filtered);
      } else if (categoriesRes.data.categories.length > 0 && !formData.category) {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Filter sub-categories when category changes
    if (name === 'category') {
      const filtered = subCategories.filter(sub => sub.category === value);
      setFilteredSubCategories(filtered);
      setFormData(prev => ({ ...prev, category: value, subCategory: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected via browse:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log('✓ Image set successfully via browse');
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
    
    console.log('=== DROP EVENT ===');
    const files = e.dataTransfer.files;
    console.log('Files count:', files.length);
    
    if (files && files.length > 0) {
      const file = files[0];
      console.log('Dropped file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        constructor: file.constructor.name
      });
      
      if (file.type.startsWith('image/')) {
        // Use the file directly without creating a new File object
        setImage(file);
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
        console.log('✓ Image state updated');
        
        // Verify the state was set
        setTimeout(() => {
          console.log('Image in state after drop:', file.name);
        }, 100);
      } else {
        console.log('✗ Not an image file');
        alert('Please drop an image file (JPG, PNG, GIF, WEBP, AVIF, BMP, SVG)');
      }
    } else {
      console.log('✗ No files in drop event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image && !editingId) {
      alert('Please select an image');
      return;
    }

    if (formData.focusArea.length === 0) {
      alert('Please select at least one focus area');
      return;
    }

    console.log('=== FORM SUBMISSION START ===');
    console.log('Editing ID:', editingId);
    console.log('Image state:', image);
    console.log('Image details:', image ? {
      name: image.name,
      type: image.type,
      size: image.size,
      constructor: image.constructor.name
    } : 'No image');
    console.log('Form Data:', formData);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('subCategory', formData.subCategory || '');
    data.append('shortDescription', formData.shortDescription);
    data.append('instructions', formData.instructions);
    data.append('benefits', formData.benefits);
    data.append('properFormTips', formData.properFormTips);
    data.append('commonMistakes', formData.commonMistakes);
    data.append('focusArea', JSON.stringify(formData.focusArea));
    data.append('videoLink', formData.videoLink || '');
    
    if (image) {
      data.append('image', image, image.name);
      console.log('✓ Image appended to FormData with name:', image.name);
    } else {
      console.log('✗ No image to append (keeping existing image for update)');
    }
    
    // Append focus area images if provided
    if (focusAreaFrontImage) {
      data.append('focusAreaFrontImage', focusAreaFrontImage, focusAreaFrontImage.name);
      console.log('✓ Focus Area Front Image appended');
    }
    
    if (focusAreaBackImage) {
      data.append('focusAreaBackImage', focusAreaBackImage, focusAreaBackImage.name);
      console.log('✓ Focus Area Back Image appended');
    }
    
    // Log FormData contents
    console.log('FormData contents:');
    for (let pair of data.entries()) {
      console.log('  -', pair[0], ':', typeof pair[1] === 'object' ? pair[1].constructor.name : pair[1]);
    }
    console.log('=== SENDING REQUEST ===');

    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials/${editingId}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials`;
      
      const method = editingId ? 'put' : 'post';
      
      console.log('Request method:', method);
      console.log('Request URL:', url);
      console.log('Editing ID:', editingId);
      
      const response = await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Tutorial saved successfully:', response.data);
      alert(editingId ? 'Tutorial updated successfully!' : 'Tutorial added successfully!');
      resetForm();
      
      // Navigate back to manage tutorials after update
      if (editingId) {
        navigate('/admin/manage-tutorials');
      } else {
        fetchData();
      }
    } catch (err) {
      console.error('=== ERROR SAVING TUTORIAL ===');
      console.error('Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      alert(err.response?.data?.error || 'Failed to save tutorial');
    }
  };

  const handleEdit = (tutorial) => {
    setEditingId(tutorial._id);
    setFormData({
      name: tutorial.name,
      category: tutorial.category,
      subCategory: tutorial.subCategory || '',
      shortDescription: tutorial.shortDescription,
      instructions: tutorial.instructions || '',
      benefits: tutorial.benefits || '',
      properFormTips: tutorial.properFormTips || '',
      commonMistakes: tutorial.commonMistakes || '',
      focusArea: Array.isArray(tutorial.focusArea) ? tutorial.focusArea : [],
      videoLink: tutorial.videoLink || '',
    });
    const filtered = subCategories.filter(sub => sub.category === tutorial.category);
    setFilteredSubCategories(filtered);
    setImagePreview(tutorial.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/tutorials/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert('Tutorial deleted!');
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      alert(err.response?.data?.error || 'Failed to delete tutorial');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      subCategory: '',
      shortDescription: '',
      instructions: '',
      benefits: '',
      properFormTips: '',
      commonMistakes: '',
      focusArea: [],
      videoLink: '',
    });
    setImage(null);
    setImagePreview(null);
    setFocusAreaFrontImage(null);
    setFocusAreaFrontImagePreview(null);
    setFocusAreaBackImage(null);
    setFocusAreaBackImagePreview(null);
    setEditingId(null);
    setFilteredSubCategories([]);
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
            Add Workout Tutorial
          </h1>
          <p className="text-gray-600">Create and manage workout tutorials with images and detailed instructions</p>
        </div>

        {/* Add/Edit Tutorial Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Tutorial' : 'Add New Tutorial'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workout Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout/Exercise Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Push-ups, Squats"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
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

              {/* Sub-Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category *
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub.name}>
                      {toTitleCase(sub.name)}
                    </option>
                  ))}
                </select>
                {filteredSubCategories.length === 0 && formData.category && (
                  <p className="text-sm text-red-600 mt-1">
                    No sub-categories available for {toTitleCase(formData.category)}. Please create one first.
                  </p>
                )}
              </div>
            </div>

            {/* Short Description */}
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
                placeholder="Brief description (1-2 sentences)"
              />
            </div>

            {/* Focus Area Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Focus Area * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['Shoulders', 'Chest', 'Back', 'Triceps', 'Biceps', 'Glutes', 'Calves', 'Adductors', 'Abs', 'Forearms', 'Quadriceps', 'Hamstrings', 'Arms', 'Deltoids', 'Pectorals'].map((area) => (
                  <label
                    key={area}
                    className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.focusArea.includes(area)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.focusArea.includes(area)}
                      onChange={(e) => {
                        const newFocusAreas = e.target.checked
                          ? [...formData.focusArea, area]
                          : formData.focusArea.filter((a) => a !== area);
                        setFormData({ ...formData, focusArea: newFocusAreas });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{area}</span>
                  </label>
                ))}
              </div>
              {formData.focusArea.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Please select at least one focus area</p>
              )}
            </div>

            {/* Focus Area Images - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Focus Area Front Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focus Area Front Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  {focusAreaFrontImagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <img
                          src={focusAreaFrontImagePreview}
                          alt="Front Preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFocusAreaFrontImage(null);
                            setFocusAreaFrontImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">Front view</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <label className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition text-sm font-medium">
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload Front</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFocusAreaFrontImage(file);
                              setFocusAreaFrontImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500">Front body view</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Focus Area Back Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focus Area Back Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  {focusAreaBackImagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <img
                          src={focusAreaBackImagePreview}
                          alt="Back Preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFocusAreaBackImage(null);
                            setFocusAreaBackImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">Back view</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <label className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition text-sm font-medium">
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload Back</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFocusAreaBackImage(file);
                              setFocusAreaBackImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500">Back body view</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Link (Optional)
              </label>
              <input
                type="url"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/watch?v=... or any video URL"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a YouTube or video link to help users learn the exercise
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Image * {editingId && '(Leave empty to keep current image)'}
              </label>
              
              {/* Drag and Drop Area */}
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

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions *
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Step-by-step instructions on how to perform the exercise..."
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits *
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="List the benefits of this exercise (e.g., improves cardiovascular endurance, burns calories, etc.)"
              />
            </div>

            {/* Tips for Proper Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips for Proper Form *
              </label>
              <textarea
                name="properFormTips"
                value={formData.properFormTips}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Tips to maintain proper form during the exercise..."
              />
            </div>

            {/* Common Mistakes to Avoid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Common Mistakes to Avoid *
              </label>
              <textarea
                name="commonMistakes"
                value={formData.commonMistakes}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="List common mistakes people make when performing this exercise..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                {editingId ? 'Update Tutorial' : 'Add Tutorial'}
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
      </div>
    </div>
  );
};

export default AddTutorial;
