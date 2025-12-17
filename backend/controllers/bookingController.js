import Booking from '../models/Booking.js';
import Meal from '../models/Meal.js';

// @desc    Book or Skip a meal
// @route   POST /api/bookings
export const toggleBooking = async (req, res) => {
  const { mealId, status } = req.body; // status = 'booked' or 'skipped'

  try {
    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      studentId: req.user._id,
      mealId: mealId
    });

    if (existingBooking) {
      // Update existing choice
      existingBooking.status = status;
      await existingBooking.save();
      res.json(existingBooking);
    } else {
      // Create new booking
      const booking = await Booking.create({
        studentId: req.user._id,
        mealId,
        date: meal.date,
        type: meal.type,
        status
      });
      res.status(201).json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD THIS AT THE BOTTOM

// @desc    Get booking counts for kitchen staff
// @route   GET /api/bookings/stats
export const getBookingStats = async (req, res) => {
  try {
    const { date } = req.query; // Format YYYY-MM-DD
    
    // 1. Find all bookings for this date that are "booked" (not skipped)
    const bookings = await Booking.find({ 
      date: date, 
      status: 'booked' 
    });

    // 2. Count them by mealId
    // Result format: { "mealId1": 15, "mealId2": 40 }
    const stats = {};
    bookings.forEach(b => {
      const id = b.mealId.toString();
      stats[id] = (stats[id] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};