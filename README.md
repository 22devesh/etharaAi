# 🚀 Ethara - Project Management Application

A full-stack project management application that allows users to create projects, assign tasks, and track progress with role-based access control.

## 🌟 Key Features

### ✅ Authentication System
- User signup and login with email/password
- Secure JWT-based authentication
- Password hashing with bcryptjs

### 📋 Project Management
- Create and manage projects
- Add team members to projects
- Define project status (Active, Completed, Archived)
- Set project due dates

### 📝 Task Management
- Create tasks within projects
- Assign tasks to team members
- Track task status (Todo, In Progress, Completed, On Hold)
- Set task priority (Low, Medium, High)
- Set task due dates

### 📊 Dashboard & Analytics
- Overview of all tasks
- Project statistics (total, completed, in progress, overdue)
- Recent projects and tasks
- Task status tracking
- Overdue task identification

### 🔐 Role-Based Access Control
- **Admin**: Full project management, can add/remove members
- **Member**: Can view and update tasks, limited project access

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS

## 📦 Project Structure

```
ethara/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   ├── db.js
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── ProjectDetailPage.jsx
│   │   ├── components/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and other configuration:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethara?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register a new user
- Body: `{ name, email, password, confirmPassword }`

**POST** `/api/auth/login`
- Login user
- Body: `{ email, password }`
- Returns: `{ token, user }`

**GET** `/api/auth/me`
- Get current user (requires authentication)

### Project Endpoints

**POST** `/api/projects`
- Create a new project
- Body: `{ name, description, dueDate }`
- Requires: Authentication

**GET** `/api/projects`
- Get all projects for the user

**GET** `/api/projects/:id`
- Get project by ID

**PUT** `/api/projects/:id`
- Update project (Admin only)
- Body: `{ name, description, status, dueDate }`

**DELETE** `/api/projects/:id`
- Delete project (Owner only)

**POST** `/api/projects/:id/members`
- Add member to project (Admin only)
- Body: `{ email, role }`

### Task Endpoints

**POST** `/api/tasks`
- Create a new task
- Body: `{ title, description, projectId, assignedTo, priority, dueDate }`

**GET** `/api/tasks`
- Get tasks with optional filters
- Query params: `{ projectId, status, priority }`

**GET** `/api/tasks/:id`
- Get task by ID

**PUT** `/api/tasks/:id`
- Update task
- Body: `{ title, description, status, priority, assignedTo, dueDate }`

**DELETE** `/api/tasks/:id`
- Delete task

**GET** `/api/tasks/project/:projectId/stats`
- Get project statistics

## 🔐 Authentication & Authorization

The application uses JWT tokens for authentication:

1. User logs in or signs up
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent with each request in the Authorization header
5. Server validates token before processing requests

### Role-Based Access Control

- **Admin**: Can manage project members, update project details, delete projects
- **Member**: Can view project, create/update tasks, but cannot manage members

## 🌐 Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy Backend to Railway**
   - Go to https://railway.app/dashboard
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway will detect it's a Node.js project
   - Add environment variables in the Railway dashboard
   - Deploy

3. **Deploy Frontend to Railway**
   - In your Railway project, click "Add Service" → "GitHub"
   - Select your repository again
   - Set build command: `cd frontend && npm install && npm run build`
   - Set start command: `cd frontend && npm run preview`
   - Add environment variable: `VITE_API_URL=<backend-railway-url>/api`
   - Deploy

4. **Update MongoDB Connection**
   - If using MongoDB Atlas, ensure your IP is whitelisted
   - Or use MongoDB Atlas free tier (M0)

### Railway Environment Variables

Backend (.env):
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=<your-frontend-railway-url>
```

Frontend:
```
VITE_API_URL=<your-backend-railway-url>/api
```

## 📱 Usage Guide

### Creating a Project
1. Log in to your account
2. Navigate to "Projects"
3. Click "New Project"
4. Fill in project details
5. Click "Create"

### Managing Team Members
1. Open a project
2. Click "Add Member" in the Team Members section
3. Enter team member's email
4. They will be added as a Member (Owner can change role)

### Creating Tasks
1. Open a project
2. Click "New Task"
3. Fill in task details:
   - Title (required)
   - Description
   - Priority (Low/Medium/High)
   - Due Date
4. Click "Create Task"

### Tracking Progress
1. Go to Dashboard to see:
   - Total tasks
   - Completed tasks
   - In-progress tasks
   - Overdue tasks
2. Update task status by selecting from the status dropdown

## 🧪 Testing

### Test Accounts

You can create accounts using the signup page. For testing:

**Admin Account** (Create a project first to become admin):
- Email: admin@test.com
- Password: Test@123

**Member Account**:
- Email: member@test.com
- Password: Test@123

## 🚨 Error Handling

The application includes comprehensive error handling:
- Input validation on both frontend and backend
- Proper HTTP status codes
- User-friendly error messages
- Automatic token refresh (if needed)

## 📝 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/Member),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: String (Admin/Member)
  }],
  status: String (Active/Completed/Archived),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  status: String (Todo/In Progress/Completed/On Hold),
  priority: String (Low/Medium/High),
  dueDate: Date,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check MongoDB URI in .env
- Verify network connectivity

### Frontend not connecting to Backend
- Check CORS configuration
- Verify API URL in frontend
- Ensure backend server is running

### Authentication Issues
- Clear localStorage and login again
- Check JWT secret is same on backend
- Verify token expiration time

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the Ethara Team

## 📞 Support

For support, email support@ethara.com or open an issue on GitHub.

---

**Happy Project Managing! 🎉**
