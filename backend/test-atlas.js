import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', MONGODB_URI?.replace(/:[^:@]+@/, ':****@') || 'NOT FOUND');
console.log('');

// Test connection
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB Atlas Connected Successfully!\n');
  
  // Test User Schema
  const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' },
    offeredSkills: [{ skill: String, level: String, description: String }],
    desiredSkills: [String],
    verificationDocs: [String],
    availability: {
      timezone: { type: String, default: 'Asia/Colombo' },
      schedule: [Object]
    },
    sessionsAttended: { type: Number, default: 0 },
    sessionsTaught: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  
  // Test creating a user
  console.log('📝 Testing user creation...');
  const testEmail = `test${Date.now()}@skillshare.com`;
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: testEmail,
    password: hashedPassword,
    bio: 'Test user for MongoDB Atlas',
    location: 'Colombo',
    offeredSkills: [],
    desiredSkills: [],
    availability: { timezone: 'Asia/Colombo', schedule: [] }
  });
  
  console.log('✅ User created successfully!');
  console.log('   ID:', testUser._id);
  console.log('   Email:', testUser.email);
  console.log('   Name:', testUser.firstName, testUser.lastName);
  console.log('');
  
  // Test reading
  console.log('📖 Testing user retrieval...');
  const foundUser = await User.findById(testUser._id);
  console.log('✅ User retrieved successfully!');
  console.log('   Found:', foundUser.email);
  console.log('');
  
  // Count users
  const userCount = await User.countDocuments();
  console.log('📊 Total users in database:', userCount);
  console.log('');
  
  // Clean up test user
  await User.findByIdAndDelete(testUser._id);
  console.log('🗑️  Test user deleted');
  console.log('');
  
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ MongoDB Atlas is working perfectly!');
  console.log('✅ Registration should work now!');
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB Atlas Connection Failed!');
  console.error('');
  console.error('Error:', err.message);
  console.error('');
  
  if (err.message.includes('authentication')) {
    console.error('🔑 AUTHENTICATION ERROR:');
    console.error('   - Check your username and password in the connection string');
    console.error('   - Make sure the password is URL-encoded');
    console.error('   - Verify the database user exists in MongoDB Atlas');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('network')) {
    console.error('🌐 NETWORK ERROR:');
    console.error('   - Check your internet connection');
    console.error('   - Verify the cluster hostname is correct');
    console.error('   - Make sure IP address 0.0.0.0/0 is whitelisted');
  } else if (err.message.includes('timeout')) {
    console.error('⏱️  TIMEOUT ERROR:');
    console.error('   - Check your internet connection');
    console.error('   - Verify IP whitelist in MongoDB Atlas');
  }
  
  console.error('');
  console.error('Please fix the error and try again.');
  process.exit(1);
});

