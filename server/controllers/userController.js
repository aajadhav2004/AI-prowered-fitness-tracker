import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import DailyTracker from '../models/DailyTracker.js';
import Exercise from '../models/Exercise.js';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { calculateCaloriesBurnt, calculateBMI } from '../utils/calories.js';
import { getISTDate, getISTMidnightDate } from '../utils/getISTDate.js';

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      weight,
      height,
      age,
      gender,
      activityLevel,
      targetWeight,
      fitnessGoal,
      dietCategory,
      foodAllergies,
      preferredCuisine,
      injuries,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with all fields
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      weight: weight || null,
      height: height || null,
      age: age || null,
      gender: gender || null,
      activityLevel: activityLevel || "Moderately Active",
      targetWeight: targetWeight || null,
      fitnessGoal: fitnessGoal || "maintain",
      dietCategory: dietCategory || "non-vegetarian",
      foodAllergies: foodAllergies || [],
      preferredCuisine: preferredCuisine || null,
      injuries: injuries || null,
    });

    console.log("User created successfully:", newUser._id);
    res
      .status(201)
      .json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error("Registration error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const bmi = calculateBMI(user.weight, user.height);
    res.json({ user: { ...user.toObject(), bmi } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

export const addWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category, duration, sets, reps, notes } = req.body;

    // Debug logging
    console.log("=== Add Workout Request ===");
    console.log("Received sets:", sets, "Type:", typeof sets);
    console.log("Received reps:", reps, "Type:", typeof reps);
    console.log("Received duration:", duration, "Type:", typeof duration);

    // Validate
    if (!name || !duration) {
      return res.status(400).json({ error: "Name and duration required" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate calories with enhanced formula including sets and reps
    const weight = user.weight || 70;
    const height = user.height || 170;
    const activityLevel = user.activityLevel || "Moderately Active";
    
    const finalSets = sets ? Number(sets) : 0;
    const finalReps = reps ? Number(reps) : 0;
    const finalDuration = Number(duration);

    console.log("Final values - Sets:", finalSets, "Reps:", finalReps, "Duration:", finalDuration);
    
    const calories = calculateCaloriesBurnt(
      finalDuration, 
      weight, 
      height, 
      activityLevel, 
      category || "General",  // Exercise category
      finalSets,             // Number of sets
      finalReps              // Number of reps
    );

    // Create workout
    const workout = new Workout({
      user: userId,
      name: name.trim(),
      category: category ? category.trim() : "General",
      duration: finalDuration,
      calories: calories || 0,
      sets: finalSets,
      reps: finalReps,
      notes: notes ? notes.trim() : "",
      date: new Date()
    });

    // Save
    const saved = await workout.save();

    console.log("Saved workout - Sets:", saved.sets, "Reps:", saved.reps);
    console.log("=== End Add Workout ===");

    // Update daily tracker
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyTracker.findOneAndUpdate(
      { user: userId, date: today },
      { $inc: { totalCaloriesBurned: calories || 0, totalWorkouts: 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Workout added", workout: saved });
  } catch (err) {
    console.error("addWorkout error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};



export const getWorkoutsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const target = date ? getISTDate(new Date(date)) : getISTDate();

    const start = getISTMidnightDate(target);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: start, $lt: end }
    }).sort({ date: -1 });

    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};


export const getDailyTracker = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const d = date ? getISTDate(new Date(date)) : getISTDate();
    const dayStart = getISTMidnightDate(d);

    const dt =
      (await DailyTracker.findOne({ user: userId, date: dayStart })) || {
        totalCaloriesBurned: 0,
        totalWorkouts: 0,
      };

    res.json({ daily: dt });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};


export const getExercises = async (req, res) => {
  const items = await Exercise.find({}).lean();
  res.json({ exercises: items });
};

export const getBlogs = async (req, res) => {
  const items = await Blog.find({}).lean();
  res.json({ blogs: items });
};

export const getWeeklyTracker = async (req, res) => {
  try {
    const userId = req.user.id;

    // Today in IST midnight
    const todayIST = getISTMidnightDate(); // <-- This must return IST 00:00:00

    // Start date (7 days range)
    const startDate = new Date(todayIST);
    startDate.setDate(startDate.getDate() - 6);

    const data = await DailyTracker.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: todayIST }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata" // <-- Correct
            }
          },
          totalCalories: { $sum: "$totalCaloriesBurned" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map data
    const map = {};
    data.forEach((d) => {
      map[d._id] = d.totalCalories;
    });

    // Build final 7-day result
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(todayIST);
      dt.setDate(dt.getDate() - i);

      // FORMAT DATE IN IST (IMPORTANT)
      const key = dt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      result.push({
        date: key,
        totalCalories: map[key] || 0
      });
    }

    res.json({ weekly: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weekly tracker" });
  }
};

export const getMonthlyTracker = async (req, res) => {
  try {
    const userId = req.user.id;

    // Today in IST midnight
    const todayIST = getISTMidnightDate();

    // Start date (30 days range)
    const startDate = new Date(todayIST);
    startDate.setDate(startDate.getDate() - 29);

    const data = await DailyTracker.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: todayIST }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata"
            }
          },
          totalCalories: { $sum: "$totalCaloriesBurned" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map data
    const map = {};
    data.forEach((d) => {
      map[d._id] = d.totalCalories;
    });

    // Build final 30-day result
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const dt = new Date(todayIST);
      dt.setDate(dt.getDate() - i);

      // FORMAT DATE IN IST
      const key = dt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      result.push({
        date: key,
        totalCalories: map[key] || 0
      });
    }

    res.json({ monthly: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly tracker" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!match)
      return res.status(400).json({ error: "Current password incorrect" });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};



// Get leaderboard - all users ranked by total calories burned
export const getLeaderboard = async (req, res) => {
  try {
    console.log("=== Leaderboard Request ===");
    console.log("Current User ID:", req.user.id);
    
    const currentUserId = req.user.id;

    // Get all users first
    console.log("Fetching all users...");
    const allUsers = await User.find({}, { name: 1, email: 1 }).lean();
    console.log("Total users found:", allUsers.length);

    // Aggregate total calories for users who have workout data
    console.log("Fetching workout stats...");
    const userStats = await DailyTracker.aggregate([
      {
        $group: {
          _id: "$user",
          totalCalories: { $sum: "$totalCaloriesBurned" },
          totalWorkouts: { $sum: "$totalWorkouts" }
        }
      }
    ]);
    console.log("Users with workout data:", userStats.length);

    // Create a map of user stats
    const statsMap = {};
    userStats.forEach(stat => {
      statsMap[stat._id.toString()] = {
        totalCalories: stat.totalCalories,
        totalWorkouts: stat.totalWorkouts
      };
    });

    // Combine all users with their stats (0 if no workouts)
    const leaderboard = allUsers.map(user => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      totalCalories: statsMap[user._id.toString()]?.totalCalories || 0,
      totalWorkouts: statsMap[user._id.toString()]?.totalWorkouts || 0
    }));

    // Sort by total calories (descending)
    leaderboard.sort((a, b) => b.totalCalories - a.totalCalories);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: user.userId.toString() === currentUserId
    }));

    // Find current user's rank
    const currentUserRank = rankedLeaderboard.find(
      (user) => user.userId.toString() === currentUserId
    );

    console.log("Leaderboard generated successfully");
    console.log("Total users:", rankedLeaderboard.length);
    console.log("Current user rank:", currentUserRank?.rank);
    console.log("=== End Leaderboard Request ===");

    res.json({
      leaderboard: rankedLeaderboard,
      currentUser: currentUserRank || null,
      totalUsers: rankedLeaderboard.length
    });
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: "Failed to fetch leaderboard",
      details: error.message 
    });
  }
};
