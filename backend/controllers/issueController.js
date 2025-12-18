import Issue from '../models/Issue.js';
import RoomMessage from '../models/RoomMessage.js';
import User from '../models/User.js';

// --- ISSUE MANAGEMENT ---

// @desc Report an Issue (Student)
export const reportIssue = async (req, res) => {
  const { category, description } = req.body;
  try {
    const issue = await Issue.create({
      studentId: req.user._id,
      room: req.user.room, // Auto-tag with their current room
      category,
      description
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get Issues (Admin: All/Filtered, Student: Own)
export const getIssues = async (req, res) => {
  try {
    let filter = {};
    
    // If Student, only see own issues
    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    } 
    // If Admin and 'room' query exists, filter by that room
    else if (req.query.room) {
      filter.room = req.query.room;
    }

    const issues = await Issue.find(filter)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resolve/Warn (Admin)
export const resolveIssue = async (req, res) => {
  const { status, adminResponse, isWarning } = req.body;
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse, isWarning },
      { new: true }
    );
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ROOM CHAT ---

// @desc Get messages for my room
export const getRoomMessages = async (req, res) => {
  try {
    if (!req.user.room) return res.status(400).json({ message: "You are not assigned a room." });

    const messages = await RoomMessage.find({ room: req.user.room })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 }); // Oldest first (chat style)
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Send message to room
export const sendRoomMessage = async (req, res) => {
  const { message } = req.body;
  try {
    if (!req.user.room) return res.status(400).json({ message: "You are not assigned a room." });

    const msg = await RoomMessage.create({
      room: req.user.room,
      senderId: req.user._id,
      message
    });
    
    // Populate sender info for immediate frontend display
    await msg.populate('senderId', 'name');
    
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};