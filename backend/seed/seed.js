import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../backend/models/User.js';

dotenv.config({ path: '../backend/.env' });

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log(`🔌 Connecting to: ${uri}`);

    // Connect with strict timeout settings
    await mongoose.connect(uri, {
      family: 4, // Force IPv4
      serverSelectionTimeoutMS: 5000, // Fail fast if no connection
    });

    // WAIT for the connection to be fully 'open' before doing anything
    await new Promise((resolve, reject) => {
      const state = mongoose.connection.readyState;
      if (state === 1) { // 1 = Connected
        resolve();
      } else {
        mongoose.connection.once('open', resolve);
        mongoose.connection.once('error', reject);
      }
    });

    console.log('✅ Connection Fully OPEN.');

    // 1. Clear old data
    console.log('🧹 Clearing old users...');
    // We use the collection directly to bypass Mongoose model buffering issues
    await mongoose.connection.collection('users').deleteMany({});
    console.log('✨ Old data cleared.');

    // 2. Prepare Data
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = [
      { 
        name: 'Admin User', 
        email: 'admin@hostel.com', 
        passwordHash, 
        role: 'admin', 
        approved: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'Chef Staff', 
        email: 'staff@hostel.com', 
        passwordHash, 
        role: 'staff', 
        approved: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'Student One', 
        email: 'student@hostel.com', 
        passwordHash, 
        role: 'student', 
        approved: true, 
        room: '101',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'Pending Student', 
        email: 'pending@hostel.com', 
        passwordHash, 
        role: 'student', 
        approved: false, 
        room: '201',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    // 3. Insert Data
    console.log('🌱 Inserting new users...');
    await mongoose.connection.collection('users').insertMany(users);
    
    console.log('✅ SUCCESS: Database created and seeded!');
    console.log(`   - Added ${users.length} users.`);
    
    // Close connection cleanly
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
};

seedData();