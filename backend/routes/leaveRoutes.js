import express from 'express';
import { applyLeave, getMyLeaves, getPendingLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Student Routes
router.post('/', applyLeave);
router.get('/my', getMyLeaves);

// Admin Routes
router.get('/pending', authorize('admin'), getPendingLeaves);
router.patch('/:id/status', authorize('admin'), updateLeaveStatus);

export default router;