import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['normal', 'high', 'emergency'], default: 'normal' },
  expiresAt: { type: Date } // Optional: auto-delete old notices
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);