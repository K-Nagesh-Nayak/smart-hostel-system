import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// 🔥 FIX: load backend .env
dotenv.config(process.env.MONGO_URI);

console.log("MONGO_URI:", process.env.MONGO_URI);

const seedFeedback = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    const student = await User.findOne({ role: 'student' });
    if (!student) {
      throw new Error("No student found. Run seed.js first.");
    }

    const feedbackSamples = [
      { category: 'food', rating: 5, comment: 'Chicken was great!' },
      { category: 'food', rating: 4, comment: 'Rice was good' },
      { category: 'food', rating: 5, comment: 'Loved the dal' },
      { category: 'hygiene', rating: 3, comment: 'Table was sticky' },
      { category: 'hygiene', rating: 4, comment: 'Clean plates' },
      { category: 'staff', rating: 5, comment: 'Chef is friendly' },
      { category: 'other', rating: 2, comment: 'Too noisy' },
    ];

    const data = feedbackSamples.map(f => ({
      ...f,
      userId: student._id
    }));

    await Feedback.insertMany(data);

    console.log('✅ Added 7 fake feedback entries!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 DB disconnected');
    process.exit();
  }
};

seedFeedback();
