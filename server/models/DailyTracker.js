import mongoose from "mongoose";

const dailyTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0,
  },
  totalWorkouts: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
});

// Ensure a unique tracker per user per day
dailyTrackerSchema.index({ user: 1, date: 1 }, { unique: true });

// Export model
export default mongoose.models.DailyTracker ||
  mongoose.model("DailyTracker", dailyTrackerSchema);
