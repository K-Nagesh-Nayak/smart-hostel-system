import express from 'express';

// --- FIX IS HERE: Add 'getBookingStats' to the list inside { ... } ---
import { toggleBooking, getMyBookings, getBookingStats } from '../controllers/bookingController.js';

import { protect, authorize } from '../middleware/auth.js'; 

const router = express.Router();

router.post('/', protect, toggleBooking);
router.get('/my', protect, getMyBookings);

// This line failed before because getBookingStats wasn't imported. Now it will work.
router.get('/stats', protect, authorize('staff', 'admin'), getBookingStats);

export default router;