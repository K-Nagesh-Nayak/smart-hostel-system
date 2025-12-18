import mongoose from 'mongoose';

const roomMessageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // The chat room ID (e.g., "101")
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('RoomMessage', roomMessageSchema);