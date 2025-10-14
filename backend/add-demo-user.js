import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshare';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  offeredSkills: [{ skill: String, level: String, description: String }],
  desiredSkills: [{ skill: String, level: String, priority: String }],
  availability: {
    timezone: { type: String, default: 'Asia/Colombo' },
    schedule: [{ type: Object }]
  },
  stats: {
    sessionsTaught: { type: Number, default: 0 },
    sessionsAttended: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  followers: [{ type: String }],
  following: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

console.log('Connecting to MongoDB...');
await mongoose.connect(MONGODB_URI);
console.log('✅ Connected!');

// Add demo users
const demoUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: await bcrypt.hash('password123', 10),
    role: 'user',
    bio: 'Web developer and coding enthusiast',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'JavaScript', level: 'expert', description: '5+ years experience' },
      { skill: 'React', level: 'advanced', description: '3+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Python', level: 'beginner', priority: 'high' }
    ]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: await bcrypt.hash('password123', 10),
    role: 'user',
    bio: 'Graphic designer and artist',
    location: 'Kandy',
    offeredSkills: [
      { skill: 'Graphic Design', level: 'expert', description: '7+ years experience' }
    ]
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    location: 'Colombo'
  }
];

for (const userData of demoUsers) {
  try {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`⚠️  User exists: ${userData.email}`);
    } else {
      await User.create(userData);
      console.log(`✅ Added: ${userData.email}`);
    }
  } catch (error) {
    console.log(`❌ Error with ${userData.email}: ${error.message}`);
  }
}

console.log('');
console.log('========================================');
console.log('DEMO USERS READY!');
console.log('========================================');
console.log('john@example.com / password123');
console.log('jane@example.com / password123');  
console.log('admin@example.com / admin123');
console.log('========================================');

await mongoose.connection.close();

