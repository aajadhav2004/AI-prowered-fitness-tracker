from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

# Load model & encoders
model = joblib.load("diet_calorie_model.pkl")
le_gender = joblib.load("le_gender.pkl")
le_activity = joblib.load("le_activity.pkl")
le_goal = joblib.load("le_goal.pkl")

@app.post("/predict-calories")
def predict(data: dict):
    gender = le_gender.transform([data["gender"]])[0]
    activity = le_activity.transform([data["activity_level"]])[0]
    goal = le_goal.transform([data["goal"]])[0]

    features = np.array([[
        data["age"],
        gender,
        data["weight_kg"],
        data["height_cm"],
        activity,
        goal
    ]])

    prediction = model.predict(features)[0]

    return {
        "daily_calories": int(prediction)
    }