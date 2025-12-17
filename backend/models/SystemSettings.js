import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  hostelLocation: {
    lat: { type: Number, required: true, default: 12.9716 },
    lng: { type: Number, required: true, default: 77.5946 },
    radius: { type: Number, required: true, default: 500 } // meters
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('SystemSettings', systemSettingsSchema);