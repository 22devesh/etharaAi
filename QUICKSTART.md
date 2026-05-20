# 🚀 Quick Start Guide for Ethara

## Local Development Setup

### Step 1: Verify Prerequisites

Make sure you have installed:
- Node.js (v16+): https://nodejs.org
- MongoDB (v5+): https://www.mongodb.com/try/download/community
- Git: https://git-scm.com

### Step 2: Clone or Navigate to Project

```bash
cd d:\etharaAi
```

### Step 3: Backend Setup

```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and update:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ethara
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas instead of local:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethara?retryWrites=true&w=majority
```

#### Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Or production
npm start
```

✅ Backend should now run on `http://localhost:5000`

### Step 4: Frontend Setup (in new terminal)

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Or simply use the default (it points to localhost:5000).

#### Start Frontend Server

```bash
npm run dev
```

✅ Frontend should open at `http://localhost:3000`

## 🎯 Test the Application

### Create Test Account

1. Open http://localhost:3000
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Confirm Password: Test@123
4. Click "Sign Up"

### Test Features

1. **Dashboard**: View statistics and recent projects
2. **Create Project**: 
   - Go to Projects
   - Click "New Project"
   - Fill in details and create
3. **Create Task**:
   - Open a project
   - Click "New Task"
   - Add task details
4. **Manage Team**:
   - Click "Add Member"
   - Enter another user's email
5. **Track Progress**:
   - Update task status
   - View statistics update

## 📱 Available Routes

After login, navigate to:
- `/dashboard` - Overview and statistics
- `/projects` - All your projects
- `/projects/:id` - Project details with tasks

## 🛑 Stop Services

### Stop Backend
In backend terminal: Press `Ctrl+C`

### Stop Frontend  
In frontend terminal: Press `Ctrl+C`

## 🔧 Development Tips

### Hot Reload
- Backend: Changes auto-reload with nodemon
- Frontend: Changes auto-refresh in browser

### Database Debugging
Check MongoDB collections:
```bash
# Using MongoDB Compass (GUI)
# OR MongoDB Shell
mongosh
use ethara
db.users.find()
db.projects.find()
db.tasks.find()
```

### API Testing
Test API with curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test@123","confirmPassword":"Test@123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

## 📦 Build for Production

### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

### Build Backend
No special build needed - just ensure dependencies installed:
```bash
cd backend
npm install --production
```

## 🚀 Deploy to Railway

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for full deployment guide.

Quick deploy:
1. Push to GitHub
2. Connect GitHub to Railway
3. Add environment variables
4. Deploy!

## ❌ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
# On Windows:
net start MongoDB

# On Mac/Linux:
brew services start mongodb-community
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on 5000
- Check FRONTEND_URL in backend .env
- Verify frontend API URL points to correct backend

## 📚 Project Structure

```
ethara/
├── backend/          # Node.js + Express
├── frontend/         # React + Vite
├── README.md         # Main documentation
└── RAILWAY_DEPLOYMENT.md  # Deployment guide
```

## 💡 Features Overview

- ✅ User authentication (signup/login)
- ✅ Project management
- ✅ Task management
- ✅ Team collaboration
- ✅ Role-based access (Admin/Member)
- ✅ Progress tracking
- ✅ Dashboard with statistics

## 🎓 Learn More

- Backend API: See [README.md](./README.md#-api-documentation)
- Tech Stack: See [README.md](./README.md#-tech-stack)
- Deployment: See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 🆘 Need Help?

1. Check the logs (terminal output)
2. Verify environment variables
3. Ensure all services are running
4. Check port availability
5. Review the README.md

---

**Happy coding! 🎉**
