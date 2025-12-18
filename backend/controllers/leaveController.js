import Leave from '../models/Leave.js';

// @desc    Apply for Leave (Student)
// @route   POST /api/leaves
export const applyLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  try {
    const leave = await Leave.create({
      studentId: req.user._id,
      startDate,
      endDate,
      reason
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Leaves (Student)
// @route   GET /api/leaves/my
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Pending Leaves (Admin)
// @route   GET /api/leaves/pending
export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate('studentId', 'name room email')
      .sort({ startDate: 1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject Leave (Admin)
// @route   PATCH /api/leaves/:id/status
export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    leave.status = status;
    await leave.save();
    
    // In a real app, you might trigger a notification here
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};