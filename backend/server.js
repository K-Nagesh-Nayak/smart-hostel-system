import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js'; // <-- Import routes
import userRoutes from './routes/userRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes); // <-- Use routes

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/issues', issueRoutes);

app.use('/api/visitors', visitorRoutes);
app.use('/api/leaves', leaveRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Hostel API is running (ESM)' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});