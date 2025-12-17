import express from 'express';
import { getAllUsers, approveUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only Admin can see list or approve
router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/approve', protect, authorize('admin'), approveUser);

export default router;