import mongoose from 'mongoose';

const weeklyMenuSchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 
  },
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  items: { type: [String], required: true },
  price: { type: Number, default: 50 }
}, { timestamps: true });

// Ensure one template per day/type (e.g., only one Monday Breakfast)
weeklyMenuSchema.index({ day: 1, type: 1 }, { unique: true });

export default mongoose.model('WeeklyMenu', weeklyMenuSchema);