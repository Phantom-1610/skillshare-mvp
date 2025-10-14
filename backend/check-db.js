import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
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

// Check users
console.log('========================================');
console.log('USERS IN DATABASE:');
console.log('========================================');
const users = await User.find({}).lean();
console.log(`Total users: ${users.length}`);
console.log('');

users.forEach((user, index) => {
  console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role || 'user'}`);
  console.log(`   Active: ${user.isActive !== false}`);
  console.log('');
});

// Check messages
console.log('========================================');
console.log('MESSAGES IN DATABASE:');
console.log('========================================');
const messages = await Message.find({}).lean();
console.log(`Total messages: ${messages.length}`);
console.log('');

messages.slice(0, 5).forEach((msg, index) => {
  console.log(`${index + 1}. From: ${msg.sender} → To: ${msg.recipient}`);
  console.log(`   Content: ${msg.content.substring(0, 50)}...`);
  console.log(`   Date: ${msg.createdAt}`);
  console.log('');
});

if (messages.length > 5) {
  console.log(`... and ${messages.length - 5} more messages`);
}

console.log('========================================');
await mongoose.connection.close();
console.log('Database connection closed');

