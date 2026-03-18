import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import dailyDietRoutes from "./routes/dailyDietRoutes.js";
import Workout from './models/Workout.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use("/api/diet", dailyDietRoutes);

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Mongo connected');
    
    // Drop the old unique index if it exists
    try {
      await Workout.collection.dropIndex('user_1_name_1_date_1');
      console.log('Dropped old unique index on Workout');
    } catch (err) {
      // Index doesn't exist, that's fine
    }
    
    app.listen(PORT, () => console.log('Server listening', PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
