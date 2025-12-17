import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  location: {
    lat: Number,
    lng: Number
  },
  distanceFromHostel: Number // We store this to prove they were inside
}, { timestamps: true });

// One attendance record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);