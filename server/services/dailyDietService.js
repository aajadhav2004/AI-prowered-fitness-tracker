import axios from "axios";
import Meal from "../models/Meal.js";
import User from "../models/User.js";

// GET existing diet plan
export const getCurrentDietPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user with diet plan
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a diet plan
    if (!user.currentWeekDietPlan || !user.lastDietGeneratedAt) {
      return res.json({ 
        hasDietPlan: false,
        message: "No diet plan found. Please generate one." 
      });
    }

    // Check if the diet plan is still valid (current week)
    const now = new Date();
    const currentWeekStart = getWeekStartDate(now);
    const lastGeneratedWeekStart = getWeekStartDate(new Date(user.lastDietGeneratedAt));

    // If diet was generated in the current week, return it
    if (currentWeekStart.getTime() === lastGeneratedWeekStart.getTime()) {
      return res.json({
        hasDietPlan: true,
        ...user.currentWeekDietPlan,
        message: "This is your current week's diet plan. You can generate a new plan next week.",
        generatedAt: user.lastDietGeneratedAt,
        nextGenerationDate: getNextWeekStartDate(currentWeekStart)
      });
    } else {
      // Diet plan is from a previous week
      return res.json({ 
        hasDietPlan: false,
        message: "Your diet plan has expired. Please generate a new one for this week." 
      });
    }

  } catch (error) {
    console.error("Get Diet Plan Error:", error.message);
    res.status(500).json({ 
      message: "Error fetching diet plan" 
    });
  }
};

export const generateDailyDiet = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Fetch user profile from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!user.age || !user.gender || !user.weight || !user.height) {
      return res.status(400).json({
        message: "Please complete your profile (age, gender, weight, height) before generating diet plan",
      });
    }

    // 2️⃣ Check if diet was already generated this week
    const now = new Date();
    const currentWeekStart = getWeekStartDate(now);
    
    if (user.lastDietGeneratedAt) {
      const lastGeneratedWeekStart = getWeekStartDate(new Date(user.lastDietGeneratedAt));
      
      // If diet was generated in the current week, return the existing plan
      if (currentWeekStart.getTime() === lastGeneratedWeekStart.getTime()) {
        console.log("Returning existing diet plan for current week");
        
        if (user.currentWeekDietPlan) {
          return res.json({
            ...user.currentWeekDietPlan,
            message: "This is your current week's diet plan. You can generate a new plan next week.",
            generatedAt: user.lastDietGeneratedAt,
            nextGenerationDate: getNextWeekStartDate(currentWeekStart)
          });
        }
      }
    }

    // Map user data to ML service format
    const userProfile = {
      age: user.age,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      activityLevel: mapActivityLevel(user.activityLevel),
      goal: mapFitnessGoalToMLGoal(user.fitnessGoal),
      dietPreference: user.dietCategory === "vegetarian" ? "veg" : "non-veg"
    };

    console.log("User Profile Data:", userProfile);

    // 3️⃣ Call ML microservice
    const response = await axios.post(
      "http://127.0.0.1:8000/predict-calories",
      {
        age: userProfile.age,
        gender: userProfile.gender,
        weight_kg: userProfile.weight,
        height_cm: userProfile.height,
        activity_level: userProfile.activityLevel,
        goal: userProfile.goal
      }
    );

    console.log("ML Service Response:", response.data);

    const calories = response.data.daily_calories;

    const macros = calculateMacros(
        calories,
        userProfile.weight,
        userProfile.goal
    );

    // 4️⃣ Build real diet using DB meals
    const dietPlan = await buildDailyDiet(
      calories,
      macros,
      userProfile.dietPreference
    );

    // 5️⃣ Save the diet plan and generation timestamp to user
    user.lastDietGeneratedAt = now;
    user.currentWeekDietPlan = dietPlan;
    await user.save();

    console.log("Diet plan generated and saved for user:", userId);

    res.json({
      ...dietPlan,
      message: "New weekly diet plan generated successfully!",
      generatedAt: now,
      nextGenerationDate: getNextWeekStartDate(currentWeekStart)
    });

  } catch (error) {
    console.error("Daily Diet Error:", error.message);
    if (error.response) {
      console.error("ML Service Error Response:", error.response.data);
    }
    res.status(500).json({ 
      message: error.response?.data?.detail || "Error generating daily diet. Please ensure ML service is running." 
    });
  }
};

// Map fitness goal from User model to ML service format
function mapFitnessGoalToMLGoal(fitnessGoal) {
  const goalMap = {
    "weight_loss": "Fat Loss",
    "weight_gain": "Muscle Gain", 
    "maintain": "Maintain"
  };
  
  console.log("Mapping fitness goal:", fitnessGoal, "->", goalMap[fitnessGoal] || "Maintain");
  return goalMap[fitnessGoal] || "Maintain";
}

// Map activity level from User model to ML service format
function mapActivityLevel(activityLevel) {
  // ML model expects: "Low", "Moderate", "High" (based on training data)
  const activityMap = {
    "Sedentary": "Low",
    "Lightly Active": "Low", 
    "Moderately Active": "Moderate",
    "Moderate": "Moderate",
    "Very Active": "High",
    "Active": "High",
    "Extra Active": "High"
  };
  
  console.log("Mapping activity level:", activityLevel, "->", activityMap[activityLevel] || "Moderate");
  return activityMap[activityLevel] || "Moderate";
}

//calculate macros
function calculateMacros(calories, weight, goal) {

  let proteinPerKg;

  if (goal === "Fat Loss") proteinPerKg = 2;
  else if (goal === "Muscle Gain") proteinPerKg = 2.2;
  else proteinPerKg = 1.6; // Maintenance

  const protein = Math.round(weight * proteinPerKg);

  const fatCalories = calories * 0.25; // 25% calories from fat
  const fats = Math.round(fatCalories / 9);

  const proteinCalories = protein * 4;
  const remainingCalories = calories - proteinCalories - fatCalories;

  const carbs = Math.round(remainingCalories / 4);

  return {
    protein,
    carbs,
    fats
  };
}



// ✅ BUILD WEEKLY DIET (7 DAYS)
async function buildDailyDiet(calories, macros, dietPreference = "veg") {

  const mealSplit = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snacks: 0.10
  };

  const weeklyPlan = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Generate diet for each day of the week
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayMeals = {};

    for (let mealType in mealSplit) {
      const ratio = mealSplit[mealType];

      const target = {
        calories: Math.round(calories * ratio),
        protein: Math.round(macros.protein * ratio),
        carbs: Math.round(macros.carbs * ratio),
        fats: Math.round(macros.fats * ratio)
      };

      // Get different meals for each day to add variety
      dayMeals[mealType] = await selectMeals(
        mealType,
        target,
        dietPreference,
        dayIndex // Pass day index for variety
      );
    }

    weeklyPlan.push({
      day: days[dayIndex],
      meals: dayMeals
    });
  }

  return {
    weeklyTargetCalories: calories,
    macros,
    weeklyPlan,
    importantNotes: `This is a ${dietPreference === "veg" ? "vegetarian" : "non-vegetarian"} meal plan with ${calories} calories per day. Stay hydrated and adjust portions based on your hunger levels.`,
    hydrationRecommendation: "Drink at least 8-10 glasses of water daily. Increase intake during workouts."
  };
}


// ✅ AUTO MEAL SELECTION LOGIC WITH VARIETY
async function selectMeals(type, target, dietPreference, dayIndex = 0) {

  const meals = await Meal.find({
    type,
    dietType: dietPreference
  });

  if (!meals.length) return [];

  // Sort meals by how close they are to target macros
  meals.sort((a, b) => {

    const scoreA =
      Math.abs(a.calories - target.calories) +
      Math.abs(a.protein - target.protein) +
      Math.abs(a.carbs - target.carbs) +
      Math.abs(a.fats - target.fats);

    const scoreB =
      Math.abs(b.calories - target.calories) +
      Math.abs(b.protein - target.protein) +
      Math.abs(b.carbs - target.carbs) +
      Math.abs(b.fats - target.fats);

    return scoreA - scoreB;
  });

  // Select different meals for each day to add variety
  // For each day, skip some meals to get different options
  const startIndex = (dayIndex * 2) % Math.max(1, meals.length - 2);
  const selectedMeals = meals.slice(startIndex, startIndex + 2);
  
  // If we don't have enough meals, wrap around
  if (selectedMeals.length < 2 && meals.length > 0) {
    selectedMeals.push(...meals.slice(0, 2 - selectedMeals.length));
  }

  return selectedMeals;
}

// Helper function to get the start of the current week (Monday)
function getWeekStartDate(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0); // Set to midnight
  return weekStart;
}

// Helper function to get the start of next week
function getNextWeekStartDate(currentWeekStart) {
  const nextWeek = new Date(currentWeekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
}