import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  visitingStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: If visiting a specific student
  purpose: { type: String, required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  status: { type: String, enum: ['active', 'checked_out'], default: 'active' },
  entryBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Guard/Admin who logged them
}, { timestamps: true });

export default mongoose.model('Visitor', visitorSchema);