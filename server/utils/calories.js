export function calculateCaloriesBurnt(durationMinutes, weightKg, heightCm, activityLevel, exerciseCategory = null, sets = 0, reps = 0) {
  const weight = Number(weightKg) || 0;
  const duration = Number(durationMinutes) || 0;
  const numSets = Number(sets) || 0;
  const numReps = Number(reps) || 0;
  
  if (weight <= 0 || duration <= 0) return 0;

  // Enhanced MET values based on exercise category and intensity
  let baseMET = getBaseMETByCategory(exerciseCategory, activityLevel);
  
  // Apply sets and reps multiplier for strength training
  const intensityMultiplier = calculateIntensityMultiplier(exerciseCategory, numSets, numReps, duration);
  
  const adjustedMET = baseMET * intensityMultiplier;
  const calories = adjustedMET * weight * (duration / 60);
  
  return Math.round(calories);
}

// Get base MET value based on exercise category and activity level
function getBaseMETByCategory(category, activityLevel) {
  // Comprehensive MET mapping for all workout categories
  const categoryMETMap = {
    // Cardio Activities (High MET values)
    "Cardio": {
      "Sedentary": 4.0,
      "Lightly Active": 6.0,
      "Moderately Active": 8.0,
      "Very Active": 10.0
    },
    "Running": {
      "Sedentary": 6.0,
      "Lightly Active": 8.0,
      "Moderately Active": 10.0,
      "Very Active": 12.0
    },
    "Cycling": {
      "Sedentary": 4.0,
      "Lightly Active": 6.0,
      "Moderately Active": 8.0,
      "Very Active": 10.0
    },
    "Swimming": {
      "Sedentary": 5.0,
      "Lightly Active": 7.0,
      "Moderately Active": 9.0,
      "Very Active": 11.0
    },
    "HIIT": {
      "Sedentary": 6.0,
      "Lightly Active": 8.0,
      "Moderately Active": 10.0,
      "Very Active": 12.0
    },
    
    // Strength Training Activities (Moderate MET values)
    "Strength Training": {
      "Sedentary": 3.0,
      "Lightly Active": 4.0,
      "Moderately Active": 5.0,
      "Very Active": 6.0
    },
    "Weightlifting": {
      "Sedentary": 3.0,
      "Lightly Active": 4.0,
      "Moderately Active": 5.0,
      "Very Active": 6.0
    },
    "Bodyweight": {
      "Sedentary": 3.5,
      "Lightly Active": 4.5,
      "Moderately Active": 5.5,
      "Very Active": 6.5
    },
    "CrossFit": {
      "Sedentary": 5.0,
      "Lightly Active": 7.0,
      "Moderately Active": 9.0,
      "Very Active": 11.0
    },
    "Functional Training": {
      "Sedentary": 4.0,
      "Lightly Active": 5.0,
      "Moderately Active": 6.0,
      "Very Active": 7.0
    },
    
    // Flexibility & Mind-Body (Lower MET values)
    "Flexibility": {
      "Sedentary": 2.0,
      "Lightly Active": 2.5,
      "Moderately Active": 3.0,
      "Very Active": 3.5
    },
    "Yoga": {
      "Sedentary": 2.5,
      "Lightly Active": 3.0,
      "Moderately Active": 3.5,
      "Very Active": 4.0
    },
    "Pilates": {
      "Sedentary": 3.0,
      "Lightly Active": 3.5,
      "Moderately Active": 4.0,
      "Very Active": 4.5
    },
    
    // Sports & Martial Arts (High MET values)
    "Sports": {
      "Sedentary": 5.0,
      "Lightly Active": 7.0,
      "Moderately Active": 9.0,
      "Very Active": 11.0
    },
    "Martial Arts": {
      "Sedentary": 4.0,
      "Lightly Active": 6.0,
      "Moderately Active": 8.0,
      "Very Active": 10.0
    },
    
    // Dance (Moderate-High MET values)
    "Dance": {
      "Sedentary": 3.5,
      "Lightly Active": 5.0,
      "Moderately Active": 6.5,
      "Very Active": 8.0
    },
    
    // Body Part Specific Training (Moderate MET values)
    "Core": {
      "Sedentary": 3.0,
      "Lightly Active": 4.0,
      "Moderately Active": 5.0,
      "Very Active": 6.0
    },
    "Upper Body": {
      "Sedentary": 3.0,
      "Lightly Active": 4.0,
      "Moderately Active": 5.0,
      "Very Active": 6.0
    },
    "Lower Body": {
      "Sedentary": 3.5,
      "Lightly Active": 4.5,
      "Moderately Active": 5.5,
      "Very Active": 6.5
    },
    "Full Body": {
      "Sedentary": 4.0,
      "Lightly Active": 5.0,
      "Moderately Active": 6.0,
      "Very Active": 7.0
    },
    
    // Default fallback
    "General": {
      "Sedentary": 3.0,
      "Lightly Active": 4.5,
      "Moderately Active": 6.0,
      "Very Active": 8.0
    }
  };

  const categoryMap = categoryMETMap[category] || categoryMETMap["General"];
  return categoryMap[activityLevel] || categoryMap["Moderately Active"];
}

// Calculate intensity multiplier based on sets, reps, and duration
function calculateIntensityMultiplier(category, sets, reps, duration) {
  if (!sets || !reps || sets === 0 || reps === 0) {
    return 1.0; // No adjustment if no sets/reps data
  }

  const totalVolume = sets * reps;
  const volumePerMinute = totalVolume / duration;

  // Strength-based exercises (higher intensity with more volume)
  const strengthCategories = [
    "Strength Training", "Weightlifting", "Bodyweight", "CrossFit", 
    "Functional Training", "Core", "Upper Body", "Lower Body", "Full Body"
  ];
  
  if (strengthCategories.includes(category)) {
    // Intensity based on volume per minute for strength training
    if (volumePerMinute >= 3.0) return 1.4;      // High intensity
    else if (volumePerMinute >= 2.0) return 1.2; // Moderate intensity  
    else if (volumePerMinute >= 1.0) return 1.1; // Light intensity
    else return 1.0;                             // Very light
  }

  // Cardio exercises (sets/reps might represent intervals)
  const cardioCategories = [
    "Cardio", "Running", "Cycling", "Swimming", "HIIT", "Dance"
  ];
  
  if (cardioCategories.includes(category)) {
    // For cardio, sets might represent intervals
    if (totalVolume >= 50) return 1.3;      // High interval training
    else if (totalVolume >= 25) return 1.15; // Moderate intervals
    else return 1.0;                         // Steady state
  }

  // Flexibility and mind-body exercises (minimal intensity variation)
  const flexibilityCategories = [
    "Flexibility", "Yoga", "Pilates"
  ];
  
  if (flexibilityCategories.includes(category)) {
    // Light adjustment for flow-based practices
    if (totalVolume >= 30) return 1.1;      // Dynamic flow
    else return 1.0;                        // Static holds
  }

  // Sports and martial arts (moderate adjustment)
  const sportsCategories = [
    "Sports", "Martial Arts"
  ];
  
  if (sportsCategories.includes(category)) {
    if (totalVolume >= 100) return 1.25;    // High intensity sports
    else if (totalVolume >= 50) return 1.15; // Moderate intensity
    else return 1.0;                         // Light practice
  }

  // Default for any other categories
  if (totalVolume >= 100) return 1.2;      // High volume
  else if (totalVolume >= 50) return 1.1;  // Moderate volume
  else return 1.0;                         // Standard
}

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}
