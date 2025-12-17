import express from 'express';
import { getInventory, addItem, updateStock, cookMealDeduction } from '../controllers/groceryController.js';

import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();

// All routes require Staff or Admin role
router.get('/', protect, authorize('staff', 'admin'), getInventory);
router.post('/', protect, authorize('staff', 'admin'), addItem);
router.patch('/:id', protect, authorize('staff', 'admin'), updateStock);
router.post('/cook', protect, authorize('staff', 'admin'), cookMealDeduction);

export default router;