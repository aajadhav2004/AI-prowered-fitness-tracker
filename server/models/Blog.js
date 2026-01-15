import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Anonymous",
    trim: true,
  },
  image_url: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export model
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
