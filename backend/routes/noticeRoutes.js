import express from 'express';
import { getNotices, postNotice, deleteNotice } from '../controllers/noticeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotices);
router.post('/', protect, authorize('admin'), postNotice);
router.delete('/:id', protect, authorize('admin'), deleteNotice);

export default router;