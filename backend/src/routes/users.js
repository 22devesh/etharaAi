import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Placeholder for user routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users endpoint'
  });
});

export default router;
