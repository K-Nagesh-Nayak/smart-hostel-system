import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  items: { type: [String], required: true }, // Array of food items (e.g. ["Rice", "Dal"])
  price: { type: Number, default: 50 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Prevent duplicate meals (e.g., two lunches on the same day)
mealSchema.index({ date: 1, type: 1 }, { unique: true });

export default mongoose.model('Meal', mealSchema);