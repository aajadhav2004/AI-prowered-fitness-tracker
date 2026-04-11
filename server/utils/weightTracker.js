import User from '../models/User.js';
import Workout from '../models/Workout.js';
import { getISTDate, getISTMidnightDate } from './getISTDate.js';

/**
 * Calculate estimated weight change based on net calories
 * Formula: Net Calories = Calories Consumed - Calories Burned
 * 1 kg of body weight ≈ 7700 calories
 * This function calculates weight change over the past week
 */
export async function updateUserWeight(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.weight) {
      console.log('User not found or no weight set');
      return null;
    }

    // Check if we should update (once per week)
    const now = new Date();
    const lastUpdate = user.lastWeightUpdate || user.createdAt;
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 7) {
      console.log(`Weight update skipped - only ${daysSinceUpdate.toFixed(1)} days since last update`);
      return null;
    }

    // Get workouts from the past week
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const workouts = await Workout.find({
      user: userId,
      date: { $gte: oneWeekAgo }
    });

    // Calculate total calories burned from workouts
    const totalCaloriesBurned = workouts.reduce((sum, workout) => {
      return sum + (workout.calories || workout.caloriesBurnt || 0);
    }, 0);

    // Calculate calories consumed from diet plan
    let totalCaloriesConsumed = 0;
    
    if (user.currentWeekDietPlan && user.currentWeekDietPlan.meals) {
      // Sum up all meal calories from the weekly diet plan
      const meals = user.currentWeekDietPlan.meals;
      
      // Iterate through each day's meals
      Object.keys(meals).forEach(day => {
        const dayMeals = meals[day];
        if (dayMeals) {
          // Sum breakfast, lunch, dinner, snacks
          ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
            if (dayMeals[mealType] && dayMeals[mealType].calories) {
              totalCaloriesConsumed += dayMeals[mealType].calories;
            }
          });
        }
      });
      
      console.log(`Diet plan calories for the week: ${totalCaloriesConsumed}`);
    } else {
      // If no diet plan, estimate based on fitness goal and ML prediction
      // Use a reasonable default based on average adult needs
      const estimatedDailyCalories = user.fitnessGoal === 'weight_loss' ? 1800 :
                                     user.fitnessGoal === 'weight_gain' ? 2800 : 2300;
      totalCaloriesConsumed = estimatedDailyCalories * 7;
      console.log(`No diet plan found, using estimated calories: ${totalCaloriesConsumed}`);
    }

    // Calculate NET CALORIES
    // Net Calories = Calories Consumed - Calories Burned
    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    console.log(`=== Weight Update Calculation ===`);
    console.log(`Calories Consumed (diet): ${totalCaloriesConsumed}`);
    console.log(`Calories Burned (workouts): ${totalCaloriesBurned}`);
    console.log(`Net Calories: ${netCalories}`);

    // Calculate weight change (1 kg = 7700 calories)
    // Positive net calories = weight gain
    // Negative net calories = weight loss
    const weightChange = netCalories / 7700;

    // Calculate new weight
    let newWeight = user.weight + weightChange;

    console.log(`Calculated weight change: ${weightChange.toFixed(2)} kg`);
    console.log(`Current weight: ${user.weight} kg`);
    console.log(`Projected new weight: ${newWeight.toFixed(1)} kg`);

    // Ensure weight doesn't change too drastically (max 2kg per week)
    const maxWeightChange = 2;
    if (Math.abs(weightChange) > maxWeightChange) {
      const limitedChange = weightChange > 0 ? maxWeightChange : -maxWeightChange;
      newWeight = user.weight + limitedChange;
      console.log(`Weight change limited to ${limitedChange} kg for safety`);
    }

    // Round to 1 decimal place
    newWeight = Math.round(newWeight * 10) / 10;

    // Ensure weight stays within reasonable bounds
    if (newWeight < 30 || newWeight > 300) {
      console.log('Weight change out of reasonable bounds, skipping update');
      return null;
    }

    // Update user weight and history
    if (!user.weightHistory) {
      user.weightHistory = [];
    }

    const oldWeight = user.weight;
    
    // If this is the first weight update, save the old weight as the starting point
    if (user.weightHistory.length === 0) {
      user.weightHistory.push({
        weight: oldWeight,
        date: user.lastWeightUpdate || user.createdAt,
        source: 'initial'
      });
    }

    // Now add the new weight
    user.weightHistory.push({
      weight: newWeight,
      date: now,
      source: 'auto'
    });

    // Keep only last 52 weeks of history (1 year)
    if (user.weightHistory.length > 52) {
      user.weightHistory = user.weightHistory.slice(-52);
    }

    user.weight = newWeight;
    user.lastWeightUpdate = now;

    await user.save();

    console.log(`✓ Weight updated: ${oldWeight} kg → ${newWeight} kg (${weightChange > 0 ? '+' : ''}${weightChange.toFixed(2)} kg)`);
    console.log(`=== End Weight Update ===`);

    return {
      oldWeight,
      newWeight,
      weightChange,
      caloriesConsumed: totalCaloriesConsumed,
      caloriesBurned: totalCaloriesBurned,
      netCalories,
      workoutCount: workouts.length
    };
  } catch (err) {
    console.error('Error updating user weight:', err);
    return null;
  }
}

/**
 * Manually update user weight (when user changes it in profile)
 */
export async function recordManualWeightUpdate(userId, newWeight) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    if (!user.weightHistory) {
      user.weightHistory = [];
    }

    user.weightHistory.push({
      weight: newWeight,
      date: new Date(),
      source: 'manual'
    });

    // Keep only last 52 weeks of history
    if (user.weightHistory.length > 52) {
      user.weightHistory = user.weightHistory.slice(-52);
    }

    user.weight = newWeight;
    user.lastWeightUpdate = new Date();

    await user.save();

    return user;
  } catch (err) {
    console.error('Error recording manual weight update:', err);
    return null;
  }
}

/**
 * Get weight progress for a user
 */
export async function getWeightProgress(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    const currentWeight = user.weight;
    const targetWeight = user.targetWeight;
    
    // Get weight history from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let history = [];
    
    // If user has weight history, filter for last 30 days
    if (user.weightHistory && user.weightHistory.length > 0) {
      history = user.weightHistory.filter(h => new Date(h.date) >= thirtyDaysAgo);
    }
    
    // Build complete history for display
    const historyForDisplay = [];
    
    // ALWAYS include registration weight if user was created within 30 days
    if (user.createdAt >= thirtyDaysAgo) {
      // Get the original registration weight
      // This is either the oldest entry in ALL history (not just last 30 days)
      // or the current weight if no history exists yet
      let registrationWeight = currentWeight;
      
      if (user.weightHistory && user.weightHistory.length > 0) {
        // Sort ALL history (not just last 30 days) to find the very first weight
        const sortedAllHistory = [...user.weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
        registrationWeight = sortedAllHistory[0].weight;
      }
      
      // Check if we already have an entry at or very near registration date in our filtered history
      const hasRegistrationEntry = history.some(h => 
        Math.abs(new Date(h.date) - new Date(user.createdAt)) < 24 * 60 * 60 * 1000 // Within 1 day
      );
      
      // Only add if not already present
      if (!hasRegistrationEntry) {
        historyForDisplay.push({
          weight: registrationWeight,
          date: user.createdAt,
          source: 'registration'
        });
      }
    }
    
    // Add all weight history entries from last 30 days
    historyForDisplay.push(...history);
    
    // Add current weight if it's different from the last entry
    const lastHistoryWeight = historyForDisplay.length > 0 ? historyForDisplay[historyForDisplay.length - 1].weight : null;
    
    if (lastHistoryWeight !== currentWeight) {
      historyForDisplay.push({
        weight: currentWeight,
        date: user.lastWeightUpdate || new Date(),
        source: user.lastWeightUpdate ? 'auto' : 'current'
      });
    }
    
    // Sort by date to ensure chronological order
    historyForDisplay.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate min/max from all weights
    const allWeights = historyForDisplay.map(h => h.weight);
    const highest = allWeights.length > 0 ? Math.max(...allWeights) : currentWeight;
    const lowest = allWeights.length > 0 ? Math.min(...allWeights) : currentWeight;
    const startWeight = historyForDisplay.length > 0 ? historyForDisplay[0].weight : currentWeight;
    const totalChange = currentWeight - startWeight;

    return {
      currentWeight,
      startWeight,
      targetWeight,
      totalChange,
      highest,
      lowest,
      history: historyForDisplay.map(h => ({
        weight: h.weight,
        date: h.date,
        source: h.source
      }))
    };
  } catch (err) {
    console.error('Error getting weight progress:', err);
    return null;
  }
}
