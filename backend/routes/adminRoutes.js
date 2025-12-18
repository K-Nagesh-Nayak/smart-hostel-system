import express from 'express';
import { 
  getDashboardStats, 
  addStudent, 
  updateUser, 
  revokeUserAccess, 
  getGeoSettings, 
  updateGeoSettings 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.post('/add-student', addStudent);

// User Management Routes
router.put('/users/:id', updateUser);
router.patch('/users/:id/revoke', revokeUserAccess);

// Geo Settings
router.get('/settings/geo', getGeoSettings);
router.post('/settings/geo', updateGeoSettings);

export default router;