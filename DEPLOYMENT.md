# Deployment Guide for Render

This guide will help you deploy the AI-Powered Fitness Tracker on Render.

## Prerequisites

1. GitHub account with your code pushed
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account for database (https://www.mongodb.com/cloud/atlas)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker`)

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository: `https://github.com/aajadhav2004/AI-prowered-fitness-tracker`
4. Render will detect the `render.yaml` file
5. Set the following environment variables:

**For fitness-tracker-api service:**

- `MONGO_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = Any random secure string (e.g., `your-super-secret-jwt-key-12345`)
- `PORT` = 8080 (already set)
- `ML_SERVICE_URL` = Will be auto-set from ml service

**For fitness-tracker-ml service:**

- `PORT` = 5000 (already set)

**For fitness-tracker-frontend:**

- `REACT_APP_API_URL` = Will be auto-set from API service

6. Click "Apply" to deploy all services

### Option B: Manual Deployment

#### 1. Deploy ML Service (Python)

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `fitness-tracker-ml`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `ml-service`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: Free
4. Add environment variable:
   - `PORT` = `5000`
5. Click "Create Web Service"
6. **Copy the service URL** (e.g., `https://fitness-tracker-ml.onrender.com`)

#### 2. Deploy Backend API (Node.js)

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `fitness-tracker-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Add environment variables:
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your secret key
   - `PORT` = `8080`
   - `ML_SERVICE_URL` = ML service URL from step 1
   - `NODE_ENV` = `production`
5. Click "Create Web Service"
6. **Copy the service URL** (e.g., `https://fitness-tracker-api.onrender.com`)

#### 3. Deploy Frontend (React)

1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `fitness-tracker-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://fitness-tracker-api.onrender.com/api/user`
5. Click "Create Static Site"

## Step 3: Update CORS (if needed)

If you face CORS issues, update `server/index.js`:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-url.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

## Step 4: Seed Database (Optional)

After backend is deployed, you can seed the database:

1. Go to your backend service on Render
2. Click "Shell" tab
3. Run: `npm run seed`

## Important Notes

### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 1 service running 24/7)

### Environment Variables Summary

**Backend (.env equivalent):**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-12345
PORT=8080
ML_SERVICE_URL=https://fitness-tracker-ml.onrender.com
NODE_ENV=production
```

**Frontend (.env equivalent):**

```
REACT_APP_API_URL=https://fitness-tracker-api.onrender.com/api/user
```

**ML Service:**

```
PORT=5000
```

## Troubleshooting

### Service won't start

- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### CORS errors

- Update CORS origin in `server/index.js`
- Redeploy backend service

### ML Service errors

- Check if all .pkl files are in the repository
- Verify requirements.txt has correct versions
- Check Python version (should be 3.9+)

### Frontend can't connect to backend

- Verify `REACT_APP_API_URL` is set correctly
- Check if backend service is running
- Ensure API URL includes `/api/user` path

## Testing Deployment

1. Visit your frontend URL
2. Register a new account
3. Add a workout
4. Check if voice assistant works
5. Generate a diet plan

## Monitoring

- Check service logs in Render dashboard
- Monitor service status
- Set up alerts for service failures

## Updating Deployment

To update your deployment:

1. Push changes to GitHub
2. Render will automatically redeploy (if auto-deploy is enabled)
3. Or manually trigger deploy from Render dashboard

## Support

If you encounter issues:

- Check Render documentation: https://render.com/docs
- Review service logs
- Verify environment variables
- Check MongoDB Atlas network access
