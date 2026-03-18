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
  getMonthlyTracker,
  updatePassword,
  updateProfile,
  getLeaderboard,
} from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// Test endpoint to verify database connection
router.get("/test", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ message: "Database connected", userCount: count });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

router.post("/register", register);
router.post("/login", login);
router.put("/update", verifyToken, updateProfile);
router.put("/updatePassword", verifyToken, updatePassword);
router.get("/profile", verifyToken, getProfile);
router.post("/addWorkout", verifyToken, addWorkout);
router.get("/workouts", verifyToken, getWorkoutsByDate);
router.get("/daily", verifyToken, getDailyTracker);
router.get("/weekly", verifyToken, getWeeklyTracker);
router.get("/monthly", verifyToken, getMonthlyTracker);
router.get("/exercises", getExercises);
router.get("/blogs", getBlogs);
router.get("/leaderboard", verifyToken, getLeaderboard);


export default router;
