import User from '../models/User.js';

// @desc    Get all users (for Admin)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a student
// @route   PATCH /api/users/:id/approve
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.approved = true;
      const updatedUser = await user.save();
      res.json({ message: 'User approved', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};