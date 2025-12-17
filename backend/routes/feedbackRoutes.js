import express from 'express';
    import { submitFeedback, getFeedbackStats, getAllFeedback } from '../controllers/feedbackController.js';
    import { protect, authorize } from '../middleware/auth.js';

    const router = express.Router();

    router.post('/', protect, submitFeedback);
    router.get('/', protect, authorize('staff', 'admin'), getAllFeedback);
    router.get('/stats', protect, authorize('staff', 'admin'), getFeedbackStats);

    export default router;