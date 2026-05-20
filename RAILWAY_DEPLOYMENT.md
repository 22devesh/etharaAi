# 🚀 Railway Deployment Guide for Ethara

This guide will walk you through deploying the Ethara project management application to Railway.

## Prerequisites

- [Railway Account](https://railway.app) (Sign up for free)
- [GitHub Account](https://github.com) (Free tier)
- Git installed on your computer

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd d:\etharaAi
git init
git add .
git commit -m "Initial commit: Ethara project management app"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `ethara-app`
3. Copy the commands and push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ethara-app.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project and cluster (M0 free tier)
4. Create a database user
5. Get your connection string
6. Update it to: `mongodb+srv://username:password@cluster.mongodb.net/ethara?retryWrites=true&w=majority`

### Option B: Railway MongoDB Plugin

1. When creating your backend service on Railway, you can add MongoDB as a plugin
2. Railway will automatically provide the connection string

## Step 3: Deploy Backend to Railway

### 3.1 Create Backend Service

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Connect your GitHub account and select `ethara-app`
5. Railway will detect and deploy the backend

### 3.2 Configure Backend Environment Variables

In Railway dashboard, go to your backend service and add variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethara?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_random_secret_key_here_change_this
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-railway-url.up.railway.app
```

### 3.3 Set Build & Start Commands

- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 3.4 Generate Backend URL

After deployment, Railway will provide a public URL like:
`https://ethara-backend-production.up.railway.app`

Save this URL - you'll need it for frontend configuration.

## Step 4: Deploy Frontend to Railway

### 4.1 Create Frontend Service

1. In the same Railway project, click "Add Service" → "GitHub"
2. Select your repository again
3. Railway will auto-detect it's a Node.js project

### 4.2 Configure Frontend Build & Start

Set the following in Railway:

**Build Command**:
```bash
cd frontend && npm install && npm run build
```

**Start Command**:
```bash
cd frontend && npm run preview
```

### 4.3 Set Environment Variables

Add this variable:
```
VITE_API_URL=https://your-backend-railway-url.up.railway.app/api
```

Replace `your-backend-railway-url` with the actual URL from Step 3.4

### 4.4 Configure Port

Make sure the frontend service is listening on port `3000`.

## Step 5: Verify Deployment

### 5.1 Check Backend Status

1. Go to your backend service in Railway
2. Click "Deployments" tab
3. Verify the latest deployment shows "✓ Success"
4. Click the URL to test: `https://your-url/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 5.2 Check Frontend Status

1. Go to your frontend service in Railway
2. Click "Deployments" tab
3. Verify the latest deployment shows "✓ Success"
4. Click the URL to open the app

## Step 6: Test the Live Application

1. Open your frontend URL in a browser
2. Sign up for a new account
3. Create a project
4. Create a task
5. Verify all features work

## Troubleshooting

### Backend won't start

**Problem**: `Cannot find module 'express'`
- **Solution**: Ensure build command includes `npm install`
- Check that `package.json` is in the root of backend folder

**Problem**: `MONGODB_URI is not defined`
- **Solution**: Add the environment variable in Railway dashboard
- Ensure MongoDB is running and connection string is correct

### Frontend shows blank page

**Problem**: API calls failing
- **Solution**: Check that `VITE_API_URL` environment variable is set correctly
- Ensure backend URL doesn't have trailing slash: `https://url/api` (not `https://url/api/`)

**Problem**: Build fails
- **Solution**: Check build logs in Railway
- Ensure `npm run build` works locally first

### Login/Signup not working

**Problem**: 401 Unauthorized errors
- **Solution**: Clear browser cache and localStorage
- Verify JWT_SECRET is set on backend

**Problem**: CORS errors
- **Solution**: Check `FRONTEND_URL` environment variable on backend
- Add frontend URL to CORS whitelist in backend code if needed

## Monitoring & Logs

### View Logs in Railway

1. Go to your service in Railway
2. Click "Logs" tab
3. View real-time logs
4. Debug issues using error messages

### Common Errors & Solutions

**Error: `connection ECONNREFUSED`**
- MongoDB not accessible
- Check MongoDB URI is correct
- Whitelist Railway IPs in MongoDB Atlas

**Error: `Invalid token`**
- JWT_SECRET mismatch between deployments
- Clear browser localStorage and login again

## Auto-Deployments

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Railway will detect the changes and redeploy automatically.

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=<your-frontend-railway-url>
```

### Frontend
```
VITE_API_URL=<your-backend-railway-url>/api
```

## Production Checklist

- [ ] MongoDB database created and accessible
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Can sign up new user
- [ ] Can create project
- [ ] Can create task
- [ ] Can update task status
- [ ] Can view dashboard
- [ ] Overdue tasks show correctly

## Security Best Practices

1. **Change JWT_SECRET**: Use a strong, random string
2. **Enable HTTPS**: Railway provides free HTTPS
3. **Database Security**: Use strong MongoDB password
4. **Rate Limiting**: Consider adding rate limiting in production
5. **Input Validation**: All inputs are validated on backend

## Next Steps

1. Set up monitoring and alerts
2. Configure auto-scaling if needed
3. Set up backup strategy for MongoDB
4. Monitor error logs regularly
5. Plan for database optimization as user base grows

## Support

If you encounter issues:

1. Check Railway logs
2. Review this guide
3. Check MongoDB Atlas connection status
4. Verify all environment variables are set
5. Test locally before deploying

---

**Your Ethara app is now live! 🎉**

Share your app URL:
- Backend: `https://your-backend-url`
- Frontend: `https://your-frontend-url`
