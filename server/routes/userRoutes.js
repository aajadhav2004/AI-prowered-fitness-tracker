import express from "express";
import {
  register,
  login,
  getProfile,
  addWorkout,
  getWorkoutsByDate,
  getDailyTracker,
  getExercises,
  getBlogs,
  getWeeklyTracker,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.put("/update", verifyToken, updateProfile);
router.put("/updatePassword", verifyToken, updatePassword);
router.get("/profile", verifyToken, getProfile);
router.post("/addWorkout", verifyToken, addWorkout);
router.get("/workouts", verifyToken, getWorkoutsByDate);
router.get("/daily", verifyToken, getDailyTracker);
router.get("/weekly", verifyToken, getWeeklyTracker); 
router.get("/exercises", getExercises);
router.get("/blogs", getBlogs);


export default router;
