import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String, required: true }, // Snapshotted room number
  category: { type: String, enum: ['maintenance', 'noise', 'cleanliness', 'other'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
  adminResponse: { type: String }, // Admin's reply or warning
  isWarning: { type: Boolean, default: false }, // If true, this response is a formal warning
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Issue', issueSchema);