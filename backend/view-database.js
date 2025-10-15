import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshare';

console.log('Connecting to MongoDB...');
await mongoose.connect(MONGODB_URI);
console.log('✅ Connected!');
console.log('');

// Define schemas
const UserSchema = new mongoose.Schema({}, { strict: false });
const MessageSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

console.log('========================================');
console.log('DATABASE: skillshare');
console.log('========================================');
console.log('');

// Show all users
console.log('📊 USERS COLLECTION:');
console.log('========================================');
const users = await User.find({}).lean();
console.log(`Total users: ${users.length}`);
console.log('');

if (users.length === 0) {
  console.log('⚠️  No users in database yet');
  console.log('   Register at: http://localhost:3000/auth/register');
} else {
  users.forEach((user, index) => {
    console.log(`${index + 1}. USER ACCOUNT:`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password.substring(0, 30)}... (hashed)`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Location: ${user.location || 'Not set'}`);
    console.log(`   Bio: ${user.bio || 'Not set'}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log('');
  });
}

// Show all messages
console.log('========================================');
console.log('💬 MESSAGES COLLECTION:');
console.log('========================================');
const messages = await Message.find({}).lean();
console.log(`Total messages: ${messages.length}`);
console.log('');

if (messages.length === 0) {
  console.log('⚠️  No messages in database yet');
} else {
  messages.slice(0, 10).forEach((msg, index) => {
    console.log(`${index + 1}. MESSAGE:`);
    console.log(`   From: ${msg.sender}`);
    console.log(`   To: ${msg.recipient}`);
    console.log(`   Content: ${msg.content}`);
    console.log(`   Type: ${msg.type}`);
    console.log(`   Status: ${msg.status}`);
    console.log(`   Date: ${msg.createdAt}`);
    console.log('');
  });
  
  if (messages.length > 10) {
    console.log(`... and ${messages.length - 10} more messages`);
  }
}

console.log('========================================');
console.log('DATABASE INFO:');
console.log('========================================');
console.log(`Host: ${mongoose.connection.host}`);
console.log(`Database: ${mongoose.connection.name}`);
console.log(`Port: 27017`);
console.log('');
console.log('📁 To view with GUI:');
console.log('   Install MongoDB Compass');
console.log('   Connect to: mongodb://localhost:27017');
console.log('   Database: skillshare');
console.log('========================================');

await mongoose.connection.close();
console.log('');
console.log('Connection closed');


