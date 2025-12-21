# Deployment Guide

This guide explains how to deploy the Recipe Sharing Platform with frontend on Vercel and backend on Render.

## Environment Variables Setup

### Frontend (Vercel)

Set these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### Required Variables:
- `REACT_APP_API_URL` - Your Render backend API URL
  - **Important**: Include `/api` at the end of the URL
  - **Your Backend URL**: `https://recipe-sharing-platform-meju.onrender.com/api`
  - Set this exact value: `https://recipe-sharing-platform-meju.onrender.com/api`

#### Optional Variables (for Cloudinary image uploads):
- `REACT_APP_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET` - Your Cloudinary upload preset (defaults to `recipe-sharing`)

### Backend (Render)

Set these environment variables in your Render service settings:

1. Go to your Render dashboard
2. Select your backend service
3. Navigate to **Environment** tab
4. Add the following variables:

#### Required Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secret key for JWT token signing (generate a random string)
- `NODE_ENV` - Set to `production`

#### Optional Variables:
- `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://recipe-sharing-platform-tawny.vercel.app`)
  - This helps with CORS configuration
  - Can be a comma-separated list for multiple URLs
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `PORT` - Server port (Render sets this automatically, but you can override)

## Deployment Steps

### Frontend Deployment (Vercel)

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
3. **Set environment variables** (see above)
4. **Deploy**

### Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Configure settings**:
   - Name: `recipe-sharing-backend` (or your preferred name)
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`
4. **Set environment variables** (see above)
5. **Deploy**

## Troubleshooting

### 404 Errors

If you're seeing 404 errors:
1. **Check `REACT_APP_API_URL`** in Vercel:
   - Must include `/api` at the end
   - Must be the full Render backend URL
   - Example: `https://your-backend.onrender.com/api`

2. **Verify backend is running**:
   - Check Render logs
   - Visit `https://your-backend.onrender.com/api/health` in browser
   - Should return a JSON response with status information

### CORS Errors

If you're seeing CORS errors:
1. **Check backend CORS configuration**:
   - Ensure your Vercel URL is in the allowed origins
   - Check `server/src/server.js` for CORS settings
   - The backend should automatically allow `https://recipe-sharing-platform-tawny.vercel.app`

2. **Set `FRONTEND_URL`** environment variable in Render:
   - Add your Vercel URL to the backend environment variables
   - This ensures CORS is properly configured

### TypeError: indexOf is not a function

This error occurs when a non-string value is passed to a function expecting a string. This has been fixed in `client/src/utils/cloudinary.jsx` to handle non-string values safely.

### Network Errors

If API calls are failing:
1. **Check backend URL** is correct and accessible
2. **Verify backend is not sleeping** (Render free tier services sleep after inactivity)
3. **Check Render logs** for any backend errors
4. **Verify MongoDB connection** is working

## Testing Deployment

After deployment, test these endpoints:

1. **Backend Health Check**: `https://your-backend.onrender.com/api/health`
2. **Backend Root**: `https://your-backend.onrender.com/`
3. **Frontend**: `https://recipe-sharing-platform-tawny.vercel.app`

## Notes

- Render free tier services may take a few seconds to wake up after inactivity
- Environment variables in Vercel are only available at build time for React apps
- After changing environment variables, you need to rebuild/redeploy
- Always check both frontend and backend logs when debugging issues

