export function calculateCaloriesBurnt(durationMinutes, weightKg, heightCm, activityLevel) {
  const weight = Number(weightKg) || 0;
  const duration = Number(durationMinutes) || 0;
  if (weight <= 0 || duration <= 0) return 0;

  const MET_MAP = {
    Sedentary: 3.0,
    "Lightly Active": 4.5,
    "Moderately Active": 6.0,
    "Very Active": 8.0,
  };

  const MET = MET_MAP[activityLevel] || 5.0;
  const calories = MET * weight * (duration / 60);
  return Math.round(calories);
}

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}
