import mongoose from "mongoose";
import Meal from "./models/Meal.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const meals = [

/* ---------------- BREAKFAST (VEG) ---------------- */

{ name: "Oats with Milk", calories: 350, protein: 15, carbs: 50, fats: 8, type: "breakfast", dietType: "veg" },
{ name: "Vegetable Poha", calories: 300, protein: 8, carbs: 55, fats: 6, type: "breakfast", dietType: "veg" },
{ name: "Upma", calories: 320, protein: 9, carbs: 52, fats: 7, type: "breakfast", dietType: "veg" },
{ name: "Paneer Sandwich", calories: 380, protein: 18, carbs: 40, fats: 12, type: "breakfast", dietType: "veg" },
{ name: "Peanut Butter Toast", calories: 340, protein: 12, carbs: 38, fats: 15, type: "breakfast", dietType: "veg" },
{ name: "Banana Smoothie", calories: 300, protein: 10, carbs: 55, fats: 5, type: "breakfast", dietType: "veg" },
{ name: "Fruit Yogurt Bowl", calories: 280, protein: 9, carbs: 48, fats: 6, type: "breakfast", dietType: "veg" },
{ name: "Vegetable Omelette (Eggless)", calories: 260, protein: 11, carbs: 30, fats: 9, type: "breakfast", dietType: "veg" },
{ name: "Idli Sambar", calories: 290, protein: 9, carbs: 50, fats: 4, type: "breakfast", dietType: "veg" },
{ name: "Besan Chilla", calories: 310, protein: 14, carbs: 35, fats: 10, type: "breakfast", dietType: "veg" },

/* ---------------- BREAKFAST (NON-VEG) ---------------- */

{ name: "Boiled Eggs with Toast", calories: 330, protein: 20, carbs: 30, fats: 12, type: "breakfast", dietType: "non-veg" },
{ name: "Egg Omelette Toast", calories: 360, protein: 22, carbs: 28, fats: 16, type: "breakfast", dietType: "non-veg" },
{ name: "Chicken Sandwich", calories: 400, protein: 28, carbs: 35, fats: 14, type: "breakfast", dietType: "non-veg" },
{ name: "Egg Bhurji with Roti", calories: 370, protein: 24, carbs: 32, fats: 15, type: "breakfast", dietType: "non-veg" },
{ name: "Protein Pancakes", calories: 350, protein: 20, carbs: 40, fats: 8, type: "breakfast", dietType: "non-veg" },

/* ---------------- LUNCH (VEG) ---------------- */

{ name: "Dal Rice", calories: 450, protein: 18, carbs: 65, fats: 10, type: "lunch", dietType: "veg" },
{ name: "Rajma Rice", calories: 480, protein: 20, carbs: 70, fats: 9, type: "lunch", dietType: "veg" },
{ name: "Paneer Roti", calories: 550, protein: 25, carbs: 60, fats: 20, type: "lunch", dietType: "veg" },
{ name: "Chole Rice", calories: 500, protein: 19, carbs: 72, fats: 11, type: "lunch", dietType: "veg" },
{ name: "Vegetable Khichdi", calories: 420, protein: 14, carbs: 65, fats: 8, type: "lunch", dietType: "veg" },
{ name: "Tofu Stir Fry with Rice", calories: 460, protein: 22, carbs: 60, fats: 12, type: "lunch", dietType: "veg" },
{ name: "Vegetable Pulao", calories: 430, protein: 10, carbs: 70, fats: 9, type: "lunch", dietType: "veg" },
{ name: "Paneer Fried Rice", calories: 520, protein: 24, carbs: 65, fats: 16, type: "lunch", dietType: "veg" },
{ name: "Mixed Veg Curry with Roti", calories: 440, protein: 15, carbs: 58, fats: 12, type: "lunch", dietType: "veg" },
{ name: "Soybean Curry with Rice", calories: 470, protein: 28, carbs: 60, fats: 11, type: "lunch", dietType: "veg" },

/* ---------------- LUNCH (NON-VEG) ---------------- */

{ name: "Grilled Chicken Rice", calories: 520, protein: 35, carbs: 55, fats: 14, type: "lunch", dietType: "non-veg" },
{ name: "Chicken Curry with Roti", calories: 540, protein: 38, carbs: 50, fats: 18, type: "lunch", dietType: "non-veg" },
{ name: "Fish Curry Rice", calories: 510, protein: 34, carbs: 52, fats: 15, type: "lunch", dietType: "non-veg" },
{ name: "Chicken Biryani", calories: 600, protein: 32, carbs: 70, fats: 20, type: "lunch", dietType: "non-veg" },
{ name: "Egg Curry Rice", calories: 500, protein: 28, carbs: 55, fats: 16, type: "lunch", dietType: "non-veg" },

/* ---------------- DINNER (VEG) ---------------- */

{ name: "Vegetable Soup with Toast", calories: 350, protein: 10, carbs: 45, fats: 8, type: "dinner", dietType: "veg" },
{ name: "Paneer Salad", calories: 380, protein: 22, carbs: 20, fats: 18, type: "dinner", dietType: "veg" },
{ name: "Dal Roti", calories: 420, protein: 18, carbs: 50, fats: 11, type: "dinner", dietType: "veg" },
{ name: "Vegetable Stir Fry", calories: 330, protein: 12, carbs: 30, fats: 10, type: "dinner", dietType: "veg" },
{ name: "Tofu Salad", calories: 350, protein: 20, carbs: 25, fats: 12, type: "dinner", dietType: "veg" },
{ name: "Vegetable Daliya", calories: 370, protein: 14, carbs: 50, fats: 8, type: "dinner", dietType: "veg" },
{ name: "Paneer Bhurji with Roti", calories: 450, protein: 26, carbs: 40, fats: 18, type: "dinner", dietType: "veg" },
{ name: "Spinach Dal with Rice", calories: 420, protein: 19, carbs: 55, fats: 9, type: "dinner", dietType: "veg" },

/* ---------------- DINNER (NON-VEG) ---------------- */

{ name: "Grilled Chicken Salad", calories: 400, protein: 35, carbs: 15, fats: 18, type: "dinner", dietType: "non-veg" },
{ name: "Fish with Steamed Veggies", calories: 420, protein: 32, carbs: 18, fats: 20, type: "dinner", dietType: "non-veg" },
{ name: "Chicken Soup", calories: 300, protein: 28, carbs: 10, fats: 12, type: "dinner", dietType: "non-veg" },
{ name: "Egg Fried Rice", calories: 450, protein: 20, carbs: 55, fats: 14, type: "dinner", dietType: "non-veg" },
{ name: "Chicken Stir Fry", calories: 430, protein: 36, carbs: 20, fats: 17, type: "dinner", dietType: "non-veg" },

/* ---------------- SNACKS (VEG) ---------------- */

{ name: "Fruit Bowl", calories: 200, protein: 3, carbs: 45, fats: 1, type: "snacks", dietType: "veg" },
{ name: "Roasted Chickpeas", calories: 220, protein: 10, carbs: 35, fats: 4, type: "snacks", dietType: "veg" },
{ name: "Peanut Chaat", calories: 240, protein: 12, carbs: 20, fats: 14, type: "snacks", dietType: "veg" },
{ name: "Greek Yogurt", calories: 180, protein: 15, carbs: 10, fats: 6, type: "snacks", dietType: "veg" },
{ name: "Protein Shake", calories: 210, protein: 22, carbs: 12, fats: 5, type: "snacks", dietType: "veg" },
{ name: "Banana with Peanut Butter", calories: 230, protein: 8, carbs: 30, fats: 10, type: "snacks", dietType: "veg" },

/* ---------------- SNACKS (NON-VEG) ---------------- */

{ name: "Boiled Eggs", calories: 160, protein: 13, carbs: 2, fats: 11, type: "snacks", dietType: "non-veg" },
{ name: "Chicken Salad", calories: 220, protein: 25, carbs: 5, fats: 12, type: "snacks", dietType: "non-veg" },
{ name: "Tuna Sandwich", calories: 260, protein: 20, carbs: 25, fats: 10, type: "snacks", dietType: "non-veg" },
{ name: "Chicken Wrap", calories: 300, protein: 28, carbs: 30, fats: 12, type: "snacks", dietType: "non-veg" }

];

const seed = async () => {
  await Meal.deleteMany();
  await Meal.insertMany(meals);
  console.log("Meals inserted");
  process.exit();
};

seed();