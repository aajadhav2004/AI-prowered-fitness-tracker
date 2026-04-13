# 💪 IntelliFit - AI-Powered Fitness Tracker

<div align="center">

![IntelliFit Logo](client/public/logo512.png)

**Your Intelligent Fitness Companion**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**IntelliFit** is a comprehensive AI-powered fitness tracking platform that helps users achieve their health and fitness goals through intelligent workout tracking, personalized diet recommendations, and real-time progress monitoring. Built with modern web technologies and powered by machine learning, IntelliFit provides a seamless experience for fitness enthusiasts of all levels.

### Why IntelliFit?

- 🤖 **AI-Powered Recommendations** - Get personalized diet and workout suggestions
- 📊 **Smart Analytics** - Track your progress with beautiful visualizations
- 🎯 **Goal-Oriented** - Set and achieve your fitness targets
- 🗣️ **Voice Assistant** - Hands-free workout logging and navigation
- 🌐 **Multi-Language Support** - Available in English, Hindi, and Marathi
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## ✨ Features

### 🏋️ Workout Management

- **Exercise Logging** - Track workouts with sets, reps, and duration
- **Calorie Calculation** - Automatic calorie burn estimation based on activity
- **Exercise Library** - Comprehensive database with video tutorials
- **Progress Tracking** - Weekly and monthly workout analytics
- **Workout Reports** - Generate and print detailed workout summaries

### 🥗 Nutrition & Diet

- **AI Diet Bot** - Intelligent chatbot for nutrition advice (powered by Google Gemini)
- **Personalized Meal Plans** - ML-based diet recommendations
- **Calorie Tracking** - Monitor daily caloric intake
- **Food Allergies Management** - Customize diet based on allergies
- **Multi-Language Support** - Get diet advice in English, Hindi, or Marathi

### 📈 Analytics & Insights

- **BMI Calculator** - Real-time BMI tracking with visual indicators
- **Weight Progress Graph** - Visualize weight changes over time
- **Workout Statistics** - Detailed analytics with charts
- **Leaderboard** - Compete with other users
- **Goal Tracking** - Monitor progress towards fitness goals

### 👤 User Management

- **Secure Authentication** - JWT-based authentication system
- **Profile Management** - Comprehensive user profiles
- **Password Reset** - OTP-based password recovery via email
- **Role-Based Access** - Separate admin and user dashboards

### 🎙️ Voice Assistant

- **Voice Commands** - Navigate and log workouts hands-free
- **Multi-Language Recognition** - Supports English, Hindi, and Marathi
- **Smart Navigation** - Voice-controlled page navigation
- **Workout Logging** - Add exercises using voice commands

### 👨‍💼 Admin Panel

- **User Management** - View and manage all users
- **Exercise Management** - CRUD operations for exercises
- **Category Management** - Organize exercises by categories and sub-categories
- **Content Management** - Manage blogs and tutorials
- **Image Upload** - Cloudinary integration for media management

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Web Speech API** - Voice recognition
- **React-to-Print** - Print functionality

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage for images

### Machine Learning

- **Python** - ML model development
- **Scikit-learn** - Machine learning library
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Flask** - ML service API

### AI Integration

- **Google Gemini AI** - Conversational AI for diet bot
- **Natural Language Processing** - Multi-language support

---

## 🏗️ Architecture

```
IntelliFit/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── api.js         # API configuration
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── package.json
│
├── ml-service/           # Python ML service
│   ├── dataset/          # Training data
│   ├── training-file/    # Jupyter notebooks
│   ├── app.py            # Flask API
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/aajadhav2004/AI-prowered-fitness-tracker.git
cd AI-prowered-fitness-tracker
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 4: Setup ML Service

```bash
cd ../ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Step 5: Configure Environment Variables

Create `.env` file in the `server` directory:

```env
# Database
MONGODB_URL=your_mongodb_connection_string

# Server
PORT=8080

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email Service
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 6: Seed Database (Optional)

```bash
cd server
npm run seed
```

---

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB Atlas account or use local MongoDB
2. Create a new database named `fitnessdb`
3. Copy the connection string to `.env` file

### Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add credentials to `.env` file

### Email Service Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add email and app password to `.env` file

### Google Gemini AI Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add API key to `.env` file

---

## 🎮 Usage

### Start the Application

#### Terminal 1 - Backend Server

```bash
cd server
npm start
# Server runs on http://localhost:8080
```

#### Terminal 2 - Frontend

```bash
cd client
npm start
# App runs on http://localhost:3000
```

#### Terminal 3 - ML Service

```bash
cd ml-service
venv\Scripts\activate  # Windows
python app.py
# ML service runs on http://localhost:5000
```

### Default Admin Credentials

```
Email: admin@intellifit.com
Password: admin123
```

### Creating Admin User

```bash
cd server
node createAdmin.js
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/user/register          - Register new user
POST   /api/user/login             - User login
POST   /api/user/forgot-password   - Send OTP for password reset
POST   /api/user/reset-password    - Reset password with OTP
```

### User Endpoints

```
GET    /api/user/profile           - Get user profile
PUT    /api/user/update            - Update user profile
PUT    /api/user/updatePassword    - Change password
GET    /api/user/leaderboard       - Get leaderboard
```

### Workout Endpoints

```
POST   /api/user/addWorkout        - Log workout
GET    /api/user/workouts          - Get workouts by date
GET    /api/user/daily             - Get daily tracker
GET    /api/user/weekly            - Get weekly statistics
GET    /api/user/monthly           - Get monthly statistics
```

### Diet Bot Endpoint

```
POST   /api/user/diet-bot          - Chat with AI diet bot
```

### Admin Endpoints

```
GET    /api/admin/users            - Get all users
GET    /api/admin/categories       - Get workout categories
POST   /api/admin/tutorials        - Add exercise tutorial
PUT    /api/admin/tutorials/:id    - Update exercise
DELETE /api/admin/tutorials/:id    - Delete exercise
```

---

## 📸 Screenshots

### User Dashboard

![Dashboard](screenshots/dashboard.png)

### Workout Tracking

![Workouts](screenshots/workouts.png)

### AI Diet Bot

![Diet Bot](screenshots/diet-bot.png)

### Exercise Tutorials

![Tutorials](screenshots/tutorials.png)

### Admin Panel

![Admin](screenshots/admin.png)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 🐛 Known Issues

- Voice assistant requires HTTPS (except localhost)
- Web Speech API has limited browser support (Chrome/Edge recommended)
- ML service requires Python 3.8+

For detailed troubleshooting, see [VOICE_ASSISTANT_TROUBLESHOOTING.md](VOICE_ASSISTANT_TROUBLESHOOTING.md)

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Social features (friend challenges)
- [ ] Wearable device integration
- [ ] Advanced ML models for predictions
- [ ] Meal photo recognition
- [ ] Video call with trainers
- [ ] Workout plan generator
- [ ] Nutrition scanner

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Avinash Jadhav**

- GitHub: [@aajadhav2004](https://github.com/aajadhav2004)
- Email: avinashjadhav2468@gmail.com

---

## 🙏 Acknowledgments

- Google Gemini AI for conversational AI
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- All open-source contributors

---

## 📞 Contact & Support

- **Email**: avinashjadhav2468@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/aajadhav2004/AI-prowered-fitness-tracker/issues)
- **Documentation**: [Wiki](https://github.com/aajadhav2004/AI-prowered-fitness-tracker/wiki)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

<div align="center">

**Made with ❤️ by Avinash Jadhav**

**Stay Fit, Stay Healthy! 💪**

</div>
