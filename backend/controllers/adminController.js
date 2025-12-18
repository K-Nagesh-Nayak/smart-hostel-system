import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Attendance from '../models/Attendance.js';
import SystemSettings from '../models/SystemSettings.js';
import bcrypt from 'bcryptjs';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Counts
    const totalStudents = await User.countDocuments({ role: 'student', approved: true });
    const mealBookings = await Booking.countDocuments({ date: today, status: 'booked' });
    const presentCount = await Attendance.countDocuments({ date: today, status: 'present' });

    // 2. Identify Absentees
    const allStudents = await User.find({ role: 'student', approved: true }).select('_id name room');
    const presentRecords = await Attendance.find({ date: today }).select('studentId');
    const presentIds = presentRecords.map(p => p.studentId.toString());

    const absentees = allStudents.filter(s => !presentIds.includes(s._id.toString()));

    // 3. Attendance Trend (Last 7 Days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        const count = await Attendance.countDocuments({ date: dayStr });
        last7Days.push({ date: dayStr, count });
    }

    res.json({
      totalStudents,
      mealBookings,
      presentCount,
      absentCount: absentees.length,
      absentees, 
      attendanceTrend: last7Days
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually Add Student (Admin)
// @route   POST /api/admin/add-student
export const addStudent = async (req, res) => {
  const { name, email, password, room } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'student',
      approved: true, // Auto-approve since Admin added them
      room,
    });

    res.status(201).json({ message: 'Student added successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Student Details (Admin)
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  const { name, room, phone } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.room = room || user.room;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();
    res.json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke User Access (Set approved=false)
// @route   PATCH /api/admin/users/:id/revoke
export const revokeUserAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.approved = false;
    await user.save();
    
    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Geolocation Settings
// @route   GET /api/admin/settings/geo
export const getGeoSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    if (settings) {
        res.json(settings.hostelLocation);
    } else {
        res.json({ lat: 12.9716, lng: 77.5946, radius: 500 }); // Defaults
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Geolocation Settings
// @route   POST /api/admin/settings/geo
export const updateGeoSettings = async (req, res) => {
  const { lat, lng, radius } = req.body;
  try {
    await SystemSettings.create({
        hostelLocation: { lat, lng, radius },
        updatedBy: req.user._id
    });
    res.json({ message: 'Geofence Updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};