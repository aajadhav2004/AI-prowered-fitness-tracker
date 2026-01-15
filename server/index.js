import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server listening', PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
