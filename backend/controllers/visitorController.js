import Visitor from '../models/Visitor.js';

// @desc    Log a new visitor entry
// @route   POST /api/visitors/entry
export const logVisitorEntry = async (req, res) => {
  const { name, phone, visitingStudent, purpose } = req.body;
  try {
    const visitor = await Visitor.create({
      name,
      phone,
      visitingStudent: visitingStudent || null, // Can be null if generic visit
      purpose,
      entryBy: req.user._id
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Checkout a visitor
// @route   PATCH /api/visitors/:id/exit
export const logVisitorExit = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    
    if (visitor.status === 'checked_out') {
        return res.status(400).json({ message: 'Visitor already checked out' });
    }

    visitor.checkOutTime = Date.now();
    visitor.status = 'checked_out';
    await visitor.save();

    res.json({ message: 'Visitor checked out', visitor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Active Visitors (Currently inside)
// @route   GET /api/visitors/active
export const getActiveVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: 'active' })
      .populate('visitingStudent', 'name room')
      .sort({ checkInTime: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Visitor History
// @route   GET /api/visitors/history
export const getVisitorHistory = async (req, res) => {
  try {
    const visitors = await Visitor.find({})
      .populate('visitingStudent', 'name room')
      .sort({ checkInTime: -1 })
      .limit(50); // Limit to last 50
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};