import express from 'express';
import { getAllUsers, getUserWorkouts, getCategories, addCategory, updateCategory, deleteCategory, getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory, getTutorials, addTutorial, updateTutorial, deleteTutorial } from '../controllers/adminController.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Admin routes - require both authentication and admin role
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/users/:userId/workouts', verifyToken, verifyAdmin, getUserWorkouts);

// Workout category routes
router.get('/categories', verifyToken, verifyAdmin, getCategories);
router.post('/categories', verifyToken, verifyAdmin, addCategory);
router.put('/categories/:id', verifyToken, verifyAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, verifyAdmin, deleteCategory);

// Sub-category routes
router.get('/sub-categories', verifyToken, verifyAdmin, getSubCategories);
router.post('/sub-categories', verifyToken, verifyAdmin, upload.single('image'), addSubCategory);
router.put('/sub-categories/:id', verifyToken, verifyAdmin, upload.single('image'), updateSubCategory);
router.delete('/sub-categories/:id', verifyToken, verifyAdmin, deleteSubCategory);

// Tutorial routes
router.get('/tutorials', verifyToken, verifyAdmin, getTutorials);
router.post('/tutorials', verifyToken, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'focusAreaFrontImage', maxCount: 1 },
  { name: 'focusAreaBackImage', maxCount: 1 }
]), addTutorial);
router.put('/tutorials/:id', verifyToken, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'focusAreaFrontImage', maxCount: 1 },
  { name: 'focusAreaBackImage', maxCount: 1 }
]), updateTutorial);
router.delete('/tutorials/:id', verifyToken, verifyAdmin, deleteTutorial);

export default router;
