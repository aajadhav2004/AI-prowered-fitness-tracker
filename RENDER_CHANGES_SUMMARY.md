# Changes Required for Render Deployment

## Files Created

### 1. `render.yaml` (Root directory)

- Blueprint configuration for automatic deployment
- Defines 3 services: API, ML Service, and Frontend
- Configures build and start commands
- Sets up environment variable connections

### 2. `ml-service/requirements.txt`

- Python dependencies for ML service
- FastAPI, uvicorn, pandas, scikit-learn, numpy, joblib

### 3. `DEPLOYMENT.md`

- Complete step-by-step deployment guide
- Environment variable configuration
- Troubleshooting tips

## Files Modified

### 1. `ml-service/app.py`

**Changes:**

- Added CORS middleware for cross-origin requests
- Added root endpoint `/` for health checks
- Added `if __name__ == "__main__"` block to run with uvicorn
- Uses `PORT` environment variable (defaults to 5000)
- Configured to bind to `0.0.0.0` for external access

### 2. `.gitignore`

**Already created** - Excludes:

- node_modules
- .env files
- Python cache
- Build outputs

## Files Already Configured (No Changes Needed)

### 1. `server/index.js`

✅ Already uses environment variables:

- `MONGODB_URL` for database
- `PORT` for server port
- CORS configured for all origins

### 2. `client/src/api.js`

✅ Already uses `REACT_APP_API_URL` environment variable
✅ Falls back to localhost for development

### 3. `server/package.json`

✅ Has `start` script for production
✅ Has `dev` script for development

## Environment Variables Needed

### Backend Service (fitness-tracker-api)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-12345
PORT=8080
ML_SERVICE_URL=https://fitness-tracker-ml.onrender.com
NODE_ENV=production
```

### ML Service (fitness-tracker-ml)

```
PORT=5000
```

### Frontend (fitness-tracker-frontend)

```
REACT_APP_API_URL=https://fitness-tracker-api.onrender.com/api/user
```

## Deployment Steps Summary

1. **Push to GitHub** ✅ (Already done)

   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Set up MongoDB Atlas**
   - Create free cluster
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0)

3. **Deploy on Render**
   - Option A: Use Blueprint (render.yaml) - Automatic
   - Option B: Manual deployment - Create 3 services separately

4. **Configure Environment Variables**
   - Set in Render dashboard for each service

5. **Test Deployment**
   - Visit frontend URL
   - Test all features

## Key Points

### ✅ What's Already Done

- Code is production-ready
- Environment variables are properly used
- CORS is configured
- API structure supports deployment

### 📝 What You Need to Do

1. Create MongoDB Atlas account and cluster
2. Create Render account
3. Connect GitHub repo to Render
4. Set environment variables in Render
5. Deploy using Blueprint or manually

### ⚠️ Important Notes

- Free tier services sleep after 15 min inactivity
- First request after sleep takes 30-60 seconds
- ML models (.pkl files) are in the repo and will deploy
- Voice assistant works in browser (uses Web Speech API)

## Testing Checklist

After deployment, test:

- [ ] User registration
- [ ] User login
- [ ] Add workout (manual)
- [ ] Add workout (voice assistant)
- [ ] View dashboard
- [ ] Generate diet plan
- [ ] View leaderboard

## Troubleshooting

### If ML Service fails:

- Check if .pkl files are in repo
- Verify Python version (3.9+)
- Check requirements.txt

### If Backend fails:

- Verify MongoDB connection string
- Check environment variables
- Review logs in Render

### If Frontend can't connect:

- Verify REACT_APP_API_URL
- Check CORS settings
- Ensure backend is running

## Cost

**Free Tier:**

- 750 hours/month per service
- Enough for 1 service running 24/7
- 3 services = need to manage usage or upgrade

**Recommendation:**

- Start with free tier
- Monitor usage
- Upgrade if needed ($7/month per service)
