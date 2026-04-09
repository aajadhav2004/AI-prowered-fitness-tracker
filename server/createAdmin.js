import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Admin credentials
    const adminData = {
      name: 'Admin',
      email: 'admin@fitness.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      weight: 70,
      height: 170,
      age: 30,
      gender: 'Male',
      activityLevel: 'Moderately Active',
      fitnessGoal: 'maintain',
      dietCategory: 'non-vegetarian'
    };

    const admin = await User.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
