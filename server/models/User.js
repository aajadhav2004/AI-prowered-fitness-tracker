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
    enum: ["Male", "Female", "Other"],
  },
  activityLevel: {
    type: String,
    default: "Moderately Active",
  },
  injuries: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model
export default mongoose.models.User || mongoose.model("User", userSchema);
