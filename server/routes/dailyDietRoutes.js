import express from "express";
import { generateDailyDiet, getCurrentDietPlan } from "../services/dailyDietService.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes - require authentication
router.get("/current", verifyToken, getCurrentDietPlan);
router.post("/generate-weekly", verifyToken, generateDailyDiet);

export default router;