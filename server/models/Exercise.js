import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  equipment: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  video_url: {
    type: String,
  },
  image_url: {
    type: String,
  },
  tips: {
    type: String,
  },
});

// Export model
export default mongoose.models.Exercise ||
  mongoose.model("Exercise", exerciseSchema);
