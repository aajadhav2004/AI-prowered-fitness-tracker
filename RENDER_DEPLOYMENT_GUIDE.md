# Complete Render Deployment Guide

## AI-Powered Fitness Tracker

---

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at https://render.com (free)
3. **MongoDB Atlas** - Free cluster at https://mongodb.com/cloud/atlas
4. **Cloudinary Account** - Free account at https://cloudinary.com
5. **Gmail App Password** - For sending emails
6. **Gemini API Key** - From https://makersuite.google.com/app/apikey

---

## STEP 1: Setup MongoDB Atlas (If not done)

1. Go to https://mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Database Access" → "Add New Database User"
   - Username: `fitnessuser`
   - Password: Create strong password
   - User Privileges: Read and write to any database
4. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
5. Click "Database" → "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://fitnessuser:yourpassword@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority`

---

## STEP 2: Deploy Backend (Node.js/Express)

### 2.1 Create Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** to connect GitHub (if first time)
4. Find and select your repository: **"AI-prowered-fitness-tracker"**
5. Click **"Connect"**

### 2.2 Configure Backend Service

Fill in the following details:

- **Name**: `fitness-tracker-backend`
- **Region**: `Oregon (US West)` or closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**:
  ```
  npm install
  ```
- **Start Command**:
  ```
  npm start
  ```
- **Instance Type**: `Free`

### 2.3 Add Environment Variables

Click **"Advanced"** → Scroll down to **"Environment Variables"**

Add these variables one by one (click "Add Environment Variable" for each):

```
NODE_ENV = production

PORT = 8080

MONGODB_URL = mongodb+srv://fitnessuser:yourpassword@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority

JWT_SECRET = your_super_secret_jwt_key_min_32_characters_long

CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name

CLOUDINARY_API_KEY = your_cloudinary_api_key

CLOUDINARY_API_SECRET = your_cloudinary_api_secret

EMAIL = your_email@gmail.com

EMAIL_PASS = your_gmail_app_password

GEMINI_API_KEY = your_gemini_api_key

FRONTEND_URL = https://fitness-tracker-frontend.onrender.com
```

**Important Notes:**

- Replace all `your_*` values with actual credentials
- For `EMAIL_PASS`, use Gmail App Password (not regular password)
  - Go to Google Account → Security → 2-Step Verification → App Passwords
- Keep `JWT_SECRET` secure and at least 32 characters
- `FRONTEND_URL` will be your frontend URL (add this after deploying frontend in Step 5)
- Note: Variable is `MONGODB_URL` (not `MONGODB_URI`) and `EMAIL` (not `EMAIL_USER`)

### 2.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: ✅ **"Live"** with a green dot
4. **Copy the backend URL**: `https://fitness-tracker-backend.onrender.com`
5. Keep this URL - you'll need it later

---

## STEP 3: Deploy ML Service (Python/FastAPI)

### 3.1 Create Web Service

1. Go back to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Select the same repository: **"AI-prowered-fitness-tracker"**
4. Click **"Connect"**

### 3.2 Configure ML Service

Fill in the following details:

- **Name**: `fitness-tracker-ml`
- **Region**: Same as backend (e.g., `Oregon`)
- **Branch**: `main`
- **Root Directory**: `ml-service`
- **Environment**: `Python 3`
- **Build Command**:
  ```
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```
  uvicorn app:app --host 0.0.0.0 --port $PORT
  ```
- **Instance Type**: `Free`

**Important**: The `runtime.txt` file in `ml-service/` folder specifies Python 3.12.1, which is compatible with the pandas version used in this project.

### 3.3 No Environment Variables Needed

Render automatically provides the `$PORT` variable.

### 3.4 Deploy ML Service

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: ✅ **"Live"**
4. **Copy the ML service URL**: `https://fitness-tracker-ml.onrender.com`

---

## STEP 4: Update Backend with ML Service URL

### 4.1 Add ML Service URL to Backend

1. Go to your **Backend Service** on Render dashboard
2. Click on **"Environment"** tab (left sidebar)
3. Click **"Add Environment Variable"**
4. Add:
   ```
   ML_SERVICE_URL = https://fitness-tracker-ml.onrender.com
   ```
   (Use your actual ML service URL from Step 3.4)
5. Click **"Save Changes"**
6. Backend will automatically redeploy (wait 2-3 minutes)

---

## STEP 5: Deploy Frontend (React)

### 5.1 Create Static Site

1. Go back to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select the same repository: **"AI-prowered-fitness-tracker"**
4. Click **"Connect"**

### 5.2 Configure Frontend

Fill in the following details:

- **Name**: `AI-prowered-fitness-tracker`
- **Branch**: `main`
- **Root Directory**: `client`
- **Build Command**:
  ```
  npm install && npm run build
  ```
- **Publish Directory**:
  ```
  build
  ```

### 5.3 Add Environment Variable

Click **"Advanced"** → Add Environment Variable:

```
REACT_APP_API_URL = https://fitness-tracker-backend.onrender.com/api
```

**Important**: Replace with your actual backend URL from Step 2.4, and add `/api` at the end.

### 5.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait 5-10 minutes for build and deployment
3. Once deployed, you'll see: ✅ **"Published"**
4. **Copy the frontend URL**: `https://AI-prowered-fitness-tracker.onrender.com`
5. This is your live application URL!

---

## STEP 6: Update Backend CORS Settings

### 6.1 Update Code Locally

Open `server/index.js` and find the CORS configuration. Update it to:

```javascript
// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://AI-prowered-fitness-tracker.onrender.com", // Replace with your actual frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
```

### 6.2 Push to GitHub

```bash
git add .
git commit -m "Update CORS for production deployment"
git push origin main
```

### 6.3 Auto-Deploy

Render will automatically detect the GitHub push and redeploy your backend (wait 2-3 minutes).

---

## STEP 7: Verify Deployment

### 7.1 Test Backend

Open in browser: `https://fitness-tracker-backend.onrender.com/`

You should see: `Cannot GET /` (this is normal - backend is running)

### 7.2 Test ML Service

Open in browser: `https://fitness-tracker-ml.onrender.com/`

You should see: `{"status":"ML Service is running"}`

### 7.3 Test Frontend

1. Open your frontend URL: `https://fitness-tracker-frontend.onrender.com`
2. You should see the login/register page
3. Try to register a new account
4. Test login
5. Add a workout
6. Generate diet plan
7. Test voice assistant (works on HTTPS ✓)
8. Upload profile picture (Cloudinary)

---

## STEP 8: Monitor and Troubleshoot

### 8.1 View Logs

For any service:

1. Go to Render Dashboard
2. Click on the service name
3. Click **"Logs"** tab (left sidebar)
4. You'll see real-time logs

### 8.2 Common Issues

**Backend fails to start:**

- Check logs for errors
- Verify all environment variables are set correctly
- Check MongoDB connection string (password, cluster URL)

**Frontend can't connect to backend:**

- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Open browser console (F12) to see errors

**ML Service fails:**

- Check logs for Python errors
- Verify `requirements.txt` has all dependencies
- Check if uvicorn is starting correctly

**Services are slow (first request):**

- Free tier services sleep after 15 minutes of inactivity
- First request takes 30-50 seconds to wake up
- This is normal for free tier

---

## STEP 9: Optional Configurations

### 9.1 Custom Domain (Optional)

1. Go to your frontend service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `fitness.yourdomain.com`)
4. Follow DNS configuration instructions

### 9.2 Disable Auto-Deploy (Optional)

If you don't want automatic deployments on every GitHub push:

1. Go to service settings
2. Click **"Settings"** → **"Build & Deploy"**
3. Toggle off **"Auto-Deploy"**

### 9.3 Environment Groups (Optional)

To reuse environment variables across services:

1. Go to Dashboard → **"Environment Groups"**
2. Create a group with common variables
3. Link to multiple services

---

## Important Notes

### Free Tier Limitations:

- ✅ 750 hours/month per service (enough for 1 service 24/7)
- ⚠️ Services sleep after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-50 seconds
- ✅ Automatic HTTPS/SSL certificates
- ✅ Auto-deploy on GitHub push

### Production Checklist:

- ✅ All environment variables set
- ✅ MongoDB allows connections from anywhere (0.0.0.0/0)
- ✅ CORS configured with frontend URL
- ✅ Cloudinary credentials working
- ✅ Email service configured
- ✅ All three services deployed and live

### Configuration Summary:

| Service        | Root Directory | Build Command                     | Start Command                                 |
| -------------- | -------------- | --------------------------------- | --------------------------------------------- |
| **Backend**    | `server`       | `npm install`                     | `npm start`                                   |
| **Frontend**   | `client`       | `npm install && npm run build`    | N/A (static)                                  |
| **ML Service** | `ml-service`   | `pip install -r requirements.txt` | `uvicorn app:app --host 0.0.0.0 --port $PORT` |

**Publish Directory for Frontend**: `build`

### URLs Summary:

- **Frontend**: `https://fitness-tracker-frontend.onrender.com`
- **Backend**: `https://fitness-tracker-backend.onrender.com`
- **ML Service**: `https://fitness-tracker-ml.onrender.com`

---

## Support

If you encounter issues:

1. Check service logs on Render
2. Check browser console (F12) for frontend errors
3. Verify all environment variables
4. Test each service individually
5. Check MongoDB Atlas network access

---

## Congratulations! 🎉

Your AI-Powered Fitness Tracker is now live on Render!

Share your frontend URL with users and start tracking fitness! 💪
