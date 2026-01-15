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
    const { name, email, password, weight, height, age, gender, activityLevel, injuries } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, weight, height, age, gender, activityLevel, injuries });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
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
    const { name, category, duration, notes, date, sets, reps, count } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const wd = date ? getISTDate(new Date(date)) : getISTDate();
    const dayStartIST = getISTMidnightDate(wd);

    const calories = calculateCaloriesBurnt(
      duration,
      user.weight,
      user.height,
      user.activityLevel
    );

    const workout = new Workout({
      user: userId,
      name,
      category,
      duration,
      calories,
      notes,
      sets,
      reps,
      count,
      date: wd // Save IST date
    });

    await workout.save();

    await DailyTracker.findOneAndUpdate(
      { user: userId, date: dayStartIST },
      {
        $inc: { totalCaloriesBurned: calories, totalWorkouts: 1 }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Workout added", workout });
  } catch (err) {
    res.status(500).json({ error: "Failed to add workout" });
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

