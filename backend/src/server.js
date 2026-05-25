import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './utils/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Middleware
// Prefer deployed frontend URL (FRONTEND_URL); fall back to Netlify URL, then localhost for local dev.
const DEFAULT_FRONTEND = process.env.FRONTEND_URL || 'https://etharaai-fullstack.netlify.app';
const allowedOrigins = [
  DEFAULT_FRONTEND,
  'https://etharaai-fullstack.netlify.app',
  'http://localhost:3000'
];

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) return true;

  // Allow Netlify preview URLs, e.g. https://deployid--etharaai-fullstack.netlify.app
  const netlifyPreviewRegex = /^https:\/\/[a-z0-9-]+--etharaai-fullstack\.netlify\.app$/i;
  return netlifyPreviewRegex.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));

// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

// Fallback headers for proxies or strict environments
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const origin = requestOrigin && isAllowedOrigin(requestOrigin) ? requestOrigin : DEFAULT_FRONTEND;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json());

// Connect to Database
connectDB();

// Fail fast with a clear message if the backend is up but MongoDB is not.
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || isDBConnected()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database is not connected. Check MONGODB_URI on the backend deployment.'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
