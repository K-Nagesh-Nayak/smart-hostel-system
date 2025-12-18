import express from 'express';
import { logVisitorEntry, logVisitorExit, getActiveVisitors, getVisitorHistory } from '../controllers/visitorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require Staff or Admin
router.use(protect);
router.use(authorize('staff', 'admin'));

router.post('/entry', logVisitorEntry);
router.patch('/:id/exit', logVisitorExit);
router.get('/active', getActiveVisitors);
router.get('/history', getVisitorHistory);

export default router;