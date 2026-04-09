import User from '../models/User.js';
import Workout from '../models/Workout.js';
import WorkoutCategory from '../models/WorkoutCategory.js';
import WorkoutSubCategory from '../models/WorkoutSubCategory.js';
import Tutorial from '../models/Tutorial.js';
import cloudinary from '../config/cloudinary.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    console.log('=== Admin getAllUsers called ===');
    console.log('User ID from token:', req.user.id);
    
    // Get all users except admins
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log('Users found:', users.length);
    console.log('Users:', users.map(u => ({ name: u.name, email: u.email, role: u.role })));
    console.log('=== Sending response ===');
    
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get workouts for a specific user (admin only)
export const getUserWorkouts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const workouts = await Workout.find({ user: userId })
      .sort({ date: -1 });
    
    res.json({ user, workouts });
  } catch (err) {
    console.error('Error fetching user workouts:', err);
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
};

// Get all workout categories
export const getCategories = async (req, res) => {
  try {
    const categories = await WorkoutCategory.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get all workout categories (public - for users)
export const getCategoriesPublic = async (req, res) => {
  try {
    const categories = await WorkoutCategory.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Add new workout category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existing = await WorkoutCategory.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await WorkoutCategory.create({ name: name.trim() });
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
};

// Update workout category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if another category with same name exists
    const existing = await WorkoutCategory.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    if (existing) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const category = await WorkoutCategory.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete workout category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await WorkoutCategory.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};


// Sub-Category Management

// Get all sub-categories
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await WorkoutSubCategory.find().sort({ createdAt: -1 });
    res.json({ subCategories });
  } catch (err) {
    console.error('Error fetching sub-categories:', err);
    res.status(500).json({ error: 'Failed to fetch sub-categories' });
  }
};

// Get all sub-categories (public - for users)
export const getSubCategoriesPublic = async (req, res) => {
  try {
    const subCategories = await WorkoutSubCategory.find().sort({ category: 1, name: 1 });
    res.json({ subCategories });
  } catch (err) {
    console.error('Error fetching sub-categories:', err);
    res.status(500).json({ error: 'Failed to fetch sub-categories' });
  }
};

// Add new sub-category
export const addSubCategory = async (req, res) => {
  try {
    const { name, category, shortDescription } = req.body;
    
    if (!name || !category || !shortDescription) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const subCategory = await WorkoutSubCategory.create({
      name: name.trim(),
      category: category.trim(),
      shortDescription: shortDescription.trim(),
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    res.status(201).json({ message: 'Sub-category added', subCategory });
  } catch (err) {
    console.error('Error adding sub-category:', err);
    res.status(500).json({ error: 'Failed to add sub-category' });
  }
};

// Update sub-category
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, shortDescription } = req.body;
    
    const subCategory = await WorkoutSubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    subCategory.name = name || subCategory.name;
    subCategory.category = category || subCategory.category;
    subCategory.shortDescription = shortDescription || subCategory.shortDescription;

    if (req.file) {
      await cloudinary.uploader.destroy(subCategory.imagePublicId);
      subCategory.imageUrl = req.file.path;
      subCategory.imagePublicId = req.file.filename;
    }

    await subCategory.save();
    res.json({ message: 'Sub-category updated', subCategory });
  } catch (err) {
    console.error('Error updating sub-category:', err);
    res.status(500).json({ error: 'Failed to update sub-category' });
  }
};

// Delete sub-category
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subCategory = await WorkoutSubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    await cloudinary.uploader.destroy(subCategory.imagePublicId);
    await WorkoutSubCategory.findByIdAndDelete(id);

    res.json({ message: 'Sub-category deleted' });
  } catch (err) {
    console.error('Error deleting sub-category:', err);
    res.status(500).json({ error: 'Failed to delete sub-category' });
  }
};


// Tutorial Management

// Get all tutorials (admin)
export const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });
    res.json({ tutorials });
  } catch (err) {
    console.error('Error fetching tutorials:', err);
    res.status(500).json({ error: 'Failed to fetch tutorials' });
  }
};

// Get all tutorials (public - for users)
export const getTutorialsPublic = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });
    res.json({ tutorials });
  } catch (err) {
    console.error('Error fetching tutorials:', err);
    res.status(500).json({ error: 'Failed to fetch tutorials' });
  }
};

// Add new tutorial
export const addTutorial = async (req, res) => {
  console.log('=== Add Tutorial Request RECEIVED ===');
  
  try {
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Files:', req.files ? Object.keys(req.files).map(key => ({
      fieldname: key,
      files: req.files[key].map(f => ({
        originalname: f.originalname,
        path: f.path,
        filename: f.filename
      }))
    })) : 'NO FILES');
    
    const { name, category, subCategory, shortDescription, instructions, benefits, properFormTips, commonMistakes, focusArea, videoLink } = req.body;
    
    // Parse focusArea if it's a JSON string
    const parsedFocusArea = typeof focusArea === 'string' ? JSON.parse(focusArea) : focusArea;
    
    if (!name || !category || !subCategory || !shortDescription || !instructions || !benefits || !properFormTips || !commonMistakes || !parsedFocusArea || parsedFocusArea.length === 0) {
      console.log('Missing fields');
      return res.status(400).json({ error: 'All fields including sub-category and at least one focus area are required' });
    }

    if (!req.files || !req.files.image) {
      console.log('No main image uploaded');
      return res.status(400).json({ error: 'Main exercise image is required' });
    }

    console.log('Creating tutorial...');

    const tutorialData = {
      name,
      category,
      subCategory,
      shortDescription,
      instructions,
      benefits,
      properFormTips,
      commonMistakes,
      focusArea: parsedFocusArea,
      videoLink: videoLink || '',
      imageUrl: req.files.image[0].path,
      imagePublicId: req.files.image[0].filename,
    };

    // Add focus area images if provided
    if (req.files.focusAreaFrontImage) {
      tutorialData.focusAreaFrontImage = req.files.focusAreaFrontImage[0].path;
      tutorialData.focusAreaFrontImagePublicId = req.files.focusAreaFrontImage[0].filename;
    }

    if (req.files.focusAreaBackImage) {
      tutorialData.focusAreaBackImage = req.files.focusAreaBackImage[0].path;
      tutorialData.focusAreaBackImagePublicId = req.files.focusAreaBackImage[0].filename;
    }

    const tutorial = await Tutorial.create(tutorialData);

    console.log('Tutorial created successfully:', tutorial._id);
    res.status(201).json({ message: 'Tutorial added', tutorial });
  } catch (err) {
    console.error('=== ERROR adding tutorial ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to add tutorial: ' + err.message });
  }
};

// Update tutorial
export const updateTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, subCategory, shortDescription, instructions, benefits, properFormTips, commonMistakes, focusArea, videoLink } = req.body;
    
    // Parse focusArea if it's a JSON string
    const parsedFocusArea = focusArea && typeof focusArea === 'string' ? JSON.parse(focusArea) : focusArea;
    
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }

    // Update fields
    tutorial.name = name || tutorial.name;
    tutorial.category = category || tutorial.category;
    tutorial.subCategory = subCategory || tutorial.subCategory;
    tutorial.shortDescription = shortDescription || tutorial.shortDescription;
    tutorial.instructions = instructions || tutorial.instructions;
    tutorial.benefits = benefits || tutorial.benefits;
    tutorial.properFormTips = properFormTips || tutorial.properFormTips;
    tutorial.commonMistakes = commonMistakes || tutorial.commonMistakes;
    tutorial.focusArea = parsedFocusArea || tutorial.focusArea;
    tutorial.videoLink = videoLink !== undefined ? videoLink : tutorial.videoLink;

    // If new main image is uploaded, delete old one and update
    if (req.files && req.files.image) {
      await cloudinary.uploader.destroy(tutorial.imagePublicId);
      tutorial.imageUrl = req.files.image[0].path;
      tutorial.imagePublicId = req.files.image[0].filename;
    }

    // Update focus area front image if provided
    if (req.files && req.files.focusAreaFrontImage) {
      if (tutorial.focusAreaFrontImagePublicId) {
        await cloudinary.uploader.destroy(tutorial.focusAreaFrontImagePublicId);
      }
      tutorial.focusAreaFrontImage = req.files.focusAreaFrontImage[0].path;
      tutorial.focusAreaFrontImagePublicId = req.files.focusAreaFrontImage[0].filename;
    }

    // Update focus area back image if provided
    if (req.files && req.files.focusAreaBackImage) {
      if (tutorial.focusAreaBackImagePublicId) {
        await cloudinary.uploader.destroy(tutorial.focusAreaBackImagePublicId);
      }
      tutorial.focusAreaBackImage = req.files.focusAreaBackImage[0].path;
      tutorial.focusAreaBackImagePublicId = req.files.focusAreaBackImage[0].filename;
    }

    await tutorial.save();

    res.json({ message: 'Tutorial updated', tutorial });
  } catch (err) {
    console.error('Error updating tutorial:', err);
    res.status(500).json({ error: 'Failed to update tutorial' });
  }
};

// Delete tutorial
export const deleteTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }

    // Delete main image from cloudinary
    await cloudinary.uploader.destroy(tutorial.imagePublicId);

    // Delete focus area images if they exist
    if (tutorial.focusAreaFrontImagePublicId) {
      await cloudinary.uploader.destroy(tutorial.focusAreaFrontImagePublicId);
    }
    if (tutorial.focusAreaBackImagePublicId) {
      await cloudinary.uploader.destroy(tutorial.focusAreaBackImagePublicId);
    }

    // Delete tutorial from database
    await Tutorial.findByIdAndDelete(id);

    res.json({ message: 'Tutorial deleted' });
  } catch (err) {
    console.error('Error deleting tutorial:', err);
    res.status(500).json({ error: 'Failed to delete tutorial' });
  }
};
