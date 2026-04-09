import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import DailyTracker from '../models/DailyTracker.js';
import Exercise from '../models/Exercise.js';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { calculateCaloriesBurnt, calculateBMI } from '../utils/calories.js';
import { getISTDate, getISTMidnightDate } from '../utils/getISTDate.js';
import { updateUserWeight, recordManualWeightUpdate, getWeightProgress } from '../utils/weightTracker.js';
import { sendPasswordResetOTP } from '../services/emailService.js';

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
    res.json({ token, role: user.role });
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
    
    // Try to update weight (will only update if it's been a week)
    updateUserWeight(userId).catch(err => {
      console.log('Weight update check:', err.message);
    });
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
    const userId = req.user.id;
    const oldUser = await User.findById(userId);
    
    // Check if weight is being updated
    const weightChanged = req.body.weight && req.body.weight !== oldUser.weight;
    
    const updated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    
    // Record manual weight update if weight changed
    if (weightChanged) {
      await recordManualWeightUpdate(userId, req.body.weight);
    }
    
    res.json({ user: updated });
  } catch (err) {
    console.error('Profile update error:', err);
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

    // Get all users except admins
    console.log("Fetching all users...");
    const allUsers = await User.find({ role: { $ne: 'admin' } }, { name: 1, email: 1 }).lean();
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


// Weight tracking endpoints

// Trigger weight update (can be called manually or via cron job)
export const triggerWeightUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await updateUserWeight(userId);
    
    if (!result) {
      return res.json({ 
        message: 'No weight update needed yet (updates weekly)',
        updated: false 
      });
    }

    res.json({ 
      message: 'Weight updated successfully',
      updated: true,
      ...result 
    });
  } catch (err) {
    console.error('Error triggering weight update:', err);
    res.status(500).json({ error: 'Failed to update weight' });
  }
};

// Get weight progress history
export const getWeightProgressData = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await getWeightProgress(userId);
    
    if (!progress) {
      return res.json({ 
        message: 'No weight history available',
        progress: null 
      });
    }

    res.json({ progress });
  } catch (err) {
    console.error('Error getting weight progress:', err);
    res.status(500).json({ error: 'Failed to get weight progress' });
  }
};


// Diet Bot - Gemini AI chatbot for diet queries
export const dietBotChat = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'API key not configured',
        response: "The Diet Bot is not configured properly. Please contact support."
      });
    }

    // Import Gemini AI
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Get user profile for personalized responses
    const user = await User.findById(req.user.id).select('-password');
    
    // Language-specific instructions
    const languageInstructions = {
      en: 'Respond in English.',
      hi: 'Respond in Hindi (हिंदी). Use Devanagari script.',
      mr: 'Respond in Marathi (मराठी). Use Devanagari script.'
    };
    
    // Create context-aware prompt with strict diet-only restriction
    const prompt = `You are "Diet Bot", a specialized nutrition and diet assistant for IntelliFit fitness app.

CRITICAL RULES:
1. ONLY answer questions related to: diet, nutrition, food, meals, calories, vitamins, minerals, eating habits, meal planning, recipes, weight management through diet, hydration, supplements, and healthy eating.
2. If the question is NOT about diet/nutrition/food, politely decline and redirect to diet topics.
3. DO NOT answer questions about: machine learning, technology, dates, time, general knowledge, sports, entertainment, or any non-diet topics.
4. NEVER use asterisks (*) in your response. Use plain text formatting only.
5. ${languageInstructions[language] || languageInstructions.en}

User Profile:
${user ? `- Name: ${user.name}
- Weight: ${user.weight || 'Not set'} kg
- Height: ${user.height || 'Not set'} cm  
- Age: ${user.age || 'Not set'}
- Goal: ${user.fitnessGoal || 'Not set'}
- Diet: ${user.dietCategory || 'Not set'}
- Allergies: ${user.foodAllergies?.length > 0 ? user.foodAllergies.join(', ') : 'None'}` : 'Profile not available'}

Response Guidelines:
- Keep responses concise (2-3 paragraphs maximum)
- Be friendly and encouraging
- Use simple, clear language
- Add emojis occasionally for friendliness 😊
- For medical concerns, advise consulting a doctor or nutritionist
- Use numbered lists or bullet points WITHOUT asterisks
- Use plain text formatting only (no bold, no asterisks)

Question: ${message}

If this question is NOT about diet, nutrition, or food, respond with:
"I'm a diet and nutrition assistant. I can only help with questions about food, meals, nutrition, and healthy eating. Please ask me about diet-related topics like meal planning, calories, nutrients, or healthy recipes!"

If it IS about diet/nutrition, provide a helpful answer in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'} WITHOUT using asterisks:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let botResponse = response.text();
    
    // Remove all asterisks from the response
    botResponse = botResponse.replace(/\*/g, '');

    console.log(`Diet Bot response generated successfully in ${language}`);
    res.json({ response: botResponse });
    
  } catch (err) {
    console.error('Diet Bot error:', err.message);
    console.error('Error details:', err);
    
    // Provide helpful error message
    let errorMessage = "I'm having trouble right now. Please try again! 🤖";
    
    if (err.message && err.message.includes('API key')) {
      errorMessage = "API key issue. Please check configuration.";
    } else if (err.message && err.message.includes('404')) {
      errorMessage = "Model not available. Trying to reconnect...";
    }
    
    res.status(500).json({ 
      error: 'Failed to get response from Diet Bot',
      response: errorMessage
    });
  }
};



// Forgot Password - Send OTP via email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP and expiry to database (10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP email
    try {
      await sendPasswordResetOTP(email, otp);
      res.json({ 
        message: 'OTP sent successfully to your email',
        email: email 
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      await user.save();
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// Reset Password - Verify OTP and update password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email: email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
