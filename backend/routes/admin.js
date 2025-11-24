import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/login', adminController.login);

// Protected routes (require valid token and admin role)
router.get('/stats', authenticateToken, isAdmin, adminController.getAdminStats);
router.get('/export', authenticateToken, isAdmin, adminController.exportToCSV);

export default router;