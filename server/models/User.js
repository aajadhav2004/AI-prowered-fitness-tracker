import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", null],
    default: null,
  },
  activityLevel: {
    type: String,
    default: "Moderately Active",
  },
  injuries: {
    type: String,
    trim: true,
  },
  // Diet Recommendation Fields
  targetWeight: {
    type: Number,
  },
  fitnessGoal: {
    type: String,
    enum: ["weight_loss", "weight_gain", "maintain"],
    default: "maintain",
  },
  dietCategory: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],
    default: "non-vegetarian",
  },
  foodAllergies: {
    type: [String],
    default: [],
  },
  preferredCuisine: {
    type: String,
    trim: true,
  },
  lastDietGeneratedAt: {
    type: Date,
    default: null,
  },
  currentWeekDietPlan: {
    type: Object,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model
export default mongoose.models.User || mongoose.model("User", userSchema);
