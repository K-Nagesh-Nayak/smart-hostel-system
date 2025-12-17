import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import SystemSettings from '../models/SystemSettings.js'; // <-- New Import
import { getDistance } from 'geolib';

// @desc    Mark Attendance (with Dynamic Geofencing)
// @route   POST /api/attendance
export const markAttendance = async (req, res) => {
  const { lat, lng } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Check if already marked
    const existing = await Attendance.findOne({ studentId: req.user._id, date: today });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location data required.' });
    }

    // 2. DYNAMIC GEOFENCING FETCH
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    
    // Default to these coords if Admin hasn't set any yet
    const HOSTEL_LOCATION = settings ? settings.hostelLocation : { lat: 12.9716, lng: 77.5946 };
    const MAX_RADIUS = settings ? settings.hostelLocation.radius : 500; // meters

    const distance = getDistance(
      { latitude: lat, longitude: lng },
      { latitude: HOSTEL_LOCATION.lat, longitude: HOSTEL_LOCATION.lng }
    );

    // Strict Check
    if (distance > MAX_RADIUS) {
      return res.status(400).json({ 
        message: `You are ${distance}m away. Must be within ${MAX_RADIUS}m of hostel.` 
      });
    }

    // 3. Create Record
    await Attendance.create({
      studentId: req.user._id,
      date: today,
      status: 'present',
      location: { lat, lng },
      distanceFromHostel: distance
    });

    res.status(201).json({ message: 'Attendance Marked Successfully', distance });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Keep existing leave functions
export const requestLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  try {
    const leave = await Leave.create({ studentId: req.user._id, startDate, endDate, reason });
    res.status(201).json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getMyStats = async (req, res) => {
  try {
    const totalPresent = await Attendance.countDocuments({ studentId: req.user._id });
    const pendingLeaves = await Leave.countDocuments({ studentId: req.user._id, status: 'pending' });
    res.json({ totalPresent, pendingLeaves });
  } catch (error) { res.status(500).json({ message: error.message }); }
};