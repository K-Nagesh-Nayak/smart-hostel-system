import express from 'express';
import { addMeal, getMeals, getTemplate, updateTemplate, applyTemplate } from '../controllers/mealController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public (Authenticated) can view, only Staff/Admin can add
router.get('/', protect, getMeals);
router.post('/', protect, authorize('staff', 'admin'), addMeal);


router.get('/template', protect, authorize('staff', 'admin'), getTemplate);
router.post('/template', protect, authorize('staff', 'admin'), updateTemplate);
router.post('/template/apply', protect, authorize('staff', 'admin'), applyTemplate);

export default router;