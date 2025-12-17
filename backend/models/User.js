import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'staff', 'admin'], required: true },
  room: { type: String },
  phone: { type: String }, // New Field
  guardianName: { type: String }, 
  approved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  // For Geo-fencing later
  location: {
     lat: Number,
     lng: Number
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);