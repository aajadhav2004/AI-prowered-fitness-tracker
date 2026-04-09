import mongoose from 'mongoose';

const workoutCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WorkoutCategory || mongoose.model('WorkoutCategory', workoutCategorySchema);
