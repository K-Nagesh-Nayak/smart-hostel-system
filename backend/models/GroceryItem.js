import mongoose from 'mongoose';

const groceryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['vegetable', 'grain', 'dairy', 'spice', 'other'], default: 'other' },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true }, // e.g., 'kg', 'liters', 'packets'
  minLevel: { type: Number, default: 10 }, // Alert if quantity drops below this
  lastUpdated: { type: Date, default: Date.now },
  
  // History for future ML/Prediction features and Staff Audit Logs
  usageHistory: [{
    date: { type: Date, default: Date.now },
    changeAmount: Number, // -5 for usage, +10 for restock
    action: { type: String, enum: ['consumed', 'restocked', 'cooked_meal'] },
    // NEW: Track who did it and why
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String // e.g., "Cooked Lunch (Chicken Curry)"
  }]
}, { timestamps: true });

export default mongoose.model('GroceryItem', groceryItemSchema);