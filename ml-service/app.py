from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# CORS configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & encoders
model = joblib.load("diet_calorie_model.pkl")
le_gender = joblib.load("le_gender.pkl")
le_activity = joblib.load("le_activity.pkl")
le_goal = joblib.load("le_goal.pkl")

@app.get("/")
def root():
    return {"status": "ML Service is running"}

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)