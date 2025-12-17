import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientRole: { type: String, enum: ['admin', 'staff', 'student'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'alert'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);