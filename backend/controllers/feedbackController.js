import Feedback from '../models/Feedback.js';

// @desc    Submit Feedback (Student)
// @route   POST /api/feedback
export const submitFeedback = async (req, res) => {
  const { category, rating, comment } = req.body;
  try {
    const feedback = await Feedback.create({
      userId: req.user._id,
      category,
      rating,
      comment
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Feedback Stats for Graphs (Staff/Admin)
// @route   GET /api/feedback/stats
export const getFeedbackStats = async (req, res) => {
  try {
    // Aggregation Pipeline to calculate average ratings
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Recent Feedback List
// @route   GET /api/feedback
export const getAllFeedback = async (req, res) => {
  try {
    // FIX: Updated populate to include 'room' along with 'name'
    const feedback = await Feedback.find({})
      .populate('userId', 'name room') 
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 for performance
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};