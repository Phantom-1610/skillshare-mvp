import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshare');

await mongoose.connection.db.dropDatabase();
console.log('✅ Database cleared');

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

const hashedPassword = await bcrypt.hash('password123', 10);

const users = [
  { firstName: 'Nuwan', lastName: 'Perera', email: 'nuwan.perera@example.lk', location: 'Colombo', bio: 'Professional photographer', offeredSkills: [{ skill: 'Photography', level: 'expert' }], stats: { sessionsTaught: 45, averageRating: 4.8 } },
  { firstName: 'Priya', lastName: 'Selvam', email: 'priya.selvam@example.lk', location: 'Online', bio: 'Classical dancer', offeredSkills: [{ skill: 'Bharatanatyam Dance', level: 'expert' }], stats: { sessionsTaught: 67, averageRating: 4.9 } },
  { firstName: 'Fathima', lastName: 'Rizan', email: 'fathima.rizan@example.lk', location: 'Colombo', bio: 'Software engineer', offeredSkills: [{ skill: 'JavaScript', level: 'expert' }, { skill: 'React', level: 'expert' }], stats: { sessionsTaught: 52, averageRating: 4.7 } },
  { firstName: 'Dinesh', lastName: 'Fernando', email: 'dinesh.fernando@example.lk', location: 'Online', bio: 'Guitar instructor', offeredSkills: [{ skill: 'Guitar', level: 'expert' }], stats: { sessionsTaught: 89, averageRating: 4.9 } },
  { firstName: 'Rebecca', lastName: 'Joseph', email: 'rebecca.joseph@example.lk', location: 'Kandy', bio: 'English language teacher', offeredSkills: [{ skill: 'English Language', level: 'expert' }], stats: { sessionsTaught: 134, averageRating: 4.8 } },
  { firstName: 'Kasun', lastName: 'Wickramasinghe', email: 'kasun.wick@example.lk', location: 'Kandy', bio: 'Yoga instructor', offeredSkills: [{ skill: 'Yoga', level: 'expert' }], stats: { sessionsTaught: 156, averageRating: 4.9 } },
  { firstName: 'Aisha', lastName: 'Mohideen', email: 'aisha.mohideen@example.lk', location: 'Colombo', bio: 'Graphic designer', offeredSkills: [{ skill: 'Graphic Design', level: 'expert' }], stats: { sessionsTaught: 78, averageRating: 4.8 } },
  { firstName: 'Brandon', lastName: 'Van Dort', email: 'brandon.vandort@example.lk', location: 'Colombo', bio: 'Chef', offeredSkills: [{ skill: 'Cooking', level: 'expert' }], stats: { sessionsTaught: 92, averageRating: 4.9 } },
  { firstName: 'Chamari', lastName: 'Silva', email: 'chamari.silva@example.lk', location: 'Online', bio: 'Mathematics tutor', offeredSkills: [{ skill: 'Mathematics', level: 'expert' }], stats: { sessionsTaught: 203, averageRating: 4.9 } },
  { firstName: 'Kumar', lastName: 'Ramesh', email: 'kumar.ramesh@example.lk', location: 'Kandy', bio: 'Digital marketing specialist', offeredSkills: [{ skill: 'Digital Marketing', level: 'expert' }], stats: { sessionsTaught: 67, averageRating: 4.7 } },
  { firstName: 'Rizwan', lastName: 'Cassim', email: 'rizwan.cassim@example.lk', location: 'Kandy', bio: 'Business consultant', offeredSkills: [{ skill: 'Business Strategy', level: 'expert' }], stats: { sessionsTaught: 43, averageRating: 4.8 } },
  { firstName: 'Shanika', lastName: 'De Silva', email: 'shanika.desilva@example.lk', location: 'Colombo', bio: 'Interior designer', offeredSkills: [{ skill: 'Interior Design', level: 'expert' }], stats: { sessionsTaught: 56, averageRating: 4.8 } },
  { firstName: 'Samuel', lastName: 'Jeyaraj', email: 'samuel.jeyaraj@example.lk', location: 'Online', bio: 'Web developer', offeredSkills: [{ skill: 'Python', level: 'expert' }], stats: { sessionsTaught: 94, averageRating: 4.9 } },
  { firstName: 'Zainab', lastName: 'Noordeen', email: 'zainab.noordeen@example.lk', location: 'Colombo', bio: 'Content writer', offeredSkills: [{ skill: 'Content Writing', level: 'expert' }], stats: { sessionsTaught: 38, averageRating: 4.7 } },
  { firstName: 'Sachini', lastName: 'Rajapaksha', email: 'sachini.raja@example.lk', location: 'Colombo', bio: 'Fashion designer', offeredSkills: [{ skill: 'Fashion Design', level: 'expert' }], stats: { sessionsTaught: 71, averageRating: 4.8 } },
  { firstName: 'Anjali', lastName: 'Krishnan', email: 'anjali.krishnan@example.lk', location: 'Online', bio: 'Art teacher', offeredSkills: [{ skill: 'Painting', level: 'expert' }], stats: { sessionsTaught: 112, averageRating: 4.9 } }
];

for (const userData of users) {
  await User.create({
    ...userData,
    password: hashedPassword,
    role: 'user',
    isActive: true,
    isVerified: true,
    availability: { timezone: 'Asia/Colombo' },
    desiredSkills: [],
    followers: [],
    following: []
  });
}

console.log(`✅ Added ${users.length} Sri Lankan users`);
console.log('Password for all: password123');

await mongoose.connection.close();

