import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

// Protected routes
router.get('/', authenticateToken, isAdmin, studentController.getAllStudents);
router.get('/:id', authenticateToken, isAdmin, studentController.getStudentById);
router.get('/email/:email', authenticateToken, isAdmin, studentController.getStudentByEmail);
router.get('/year/:year', authenticateToken, isAdmin, studentController.getStudentsByYear);
router.get('/stats/all', authenticateToken, isAdmin, studentController.getStudentStats);

export default router;