import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['booked', 'skipped'], default: 'booked' }
}, { timestamps: true });

// A student can only have one booking status per meal
bookingSchema.index({ studentId: 1, mealId: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);