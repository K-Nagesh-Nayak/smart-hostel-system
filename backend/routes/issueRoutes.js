import express from 'express';
import { reportIssue, getIssues, resolveIssue, getRoomMessages, sendRoomMessage } from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Issues
router.post('/', protect, reportIssue); // Student reports
router.get('/', protect, getIssues); // Student gets own, Admin gets all
router.patch('/:id', protect, authorize('admin'), resolveIssue); // Admin resolves

// Chat
router.get('/chat', protect, getRoomMessages);
router.post('/chat', protect, sendRoomMessage);

export default router;