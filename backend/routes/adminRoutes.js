import express from 'express';
import { getDashboardStats, addStudent, getGeoSettings, updateGeoSettings } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.post('/add-student', addStudent);
router.get('/settings/geo', getGeoSettings);
router.post('/settings/geo', updateGeoSettings);

export default router;