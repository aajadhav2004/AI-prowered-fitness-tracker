import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  category: String,
  duration: Number,
  calories: Number,
  notes: String,
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

// Export model
export default mongoose.models.Workout ||
  mongoose.model("Workout", workoutSchema);
