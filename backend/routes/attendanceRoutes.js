import express from 'express';
import { markAttendance, requestLeave, getMyStats } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, markAttendance);
router.post('/leave', protect, requestLeave);
router.get('/my-stats', protect, getMyStats);

export default router;