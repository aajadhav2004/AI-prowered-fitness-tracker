import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ["breakfast", "lunch", "dinner", "snacks"], 
    required: true 
  },
  dietType: { 
    type: String, 
    enum: ["veg", "non-veg"], 
    required: true 
  }
});

export default mongoose.model("Meal", mealSchema);