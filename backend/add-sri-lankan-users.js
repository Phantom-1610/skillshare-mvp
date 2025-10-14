import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

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
  bio: String,
  location: String,
  profilePicture: String,
  offeredSkills: [{ skill: String, level: String, description: String }],
  desiredSkills: [{ skill: String, level: String, priority: String }],
  availability: {
    timezone: { type: String, default: 'Asia/Colombo' },
    status: String,
    schedule: [{ type: Object }]
  },
  stats: {
    sessionsTaught: Number,
    sessionsAttended: Number,
    averageRating: Number,
    totalRatings: Number
  },
  followers: [String],
  following: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

console.log('Connecting to MongoDB...');
await mongoose.connect(MONGODB_URI);
console.log('✅ Connected!');
console.log('');

const hashedPassword = await bcrypt.hash('password123', 10);

// Diverse Sri Lankan user profiles - all religions, races, locations
const sriLankanUsers = [
  // Sinhalese Buddhist - Colombo
  {
    firstName: 'Nuwan',
    lastName: 'Perera',
    email: 'nuwan.perera@example.lk',
    password: hashedPassword,
    bio: 'Professional photographer and visual storytelling enthusiast. Love capturing Sri Lankan landscapes.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Photography', level: 'expert', description: '8+ years experience' },
      { skill: 'Photo Editing', level: 'advanced', description: '5+ years with Adobe' }
    ],
    desiredSkills: [
      { skill: 'Videography', level: 'intermediate', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 45, sessionsAttended: 12, averageRating: 4.8, totalRatings: 32 }
  },
  
  // Tamil Hindu - Jaffna
  {
    firstName: 'Priya',
    lastName: 'Selvam',
    email: 'priya.selvam@example.lk',
    password: hashedPassword,
    bio: 'Classical dancer and music teacher. Passionate about preserving Tamil cultural arts.',
    location: 'Online',
    offeredSkills: [
      { skill: 'Bharatanatyam Dance', level: 'expert', description: '15+ years experience' },
      { skill: 'Carnatic Music', level: 'advanced', description: '10+ years' }
    ],
    desiredSkills: [
      { skill: 'Digital Marketing', level: 'beginner', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 67, sessionsAttended: 8, averageRating: 4.9, totalRatings: 54 }
  },

  // Muslim - Colombo
  {
    firstName: 'Fathima',
    lastName: 'Rizan',
    email: 'fathima.rizan@example.lk',
    password: hashedPassword,
    bio: 'Software engineer specializing in web development. Love teaching coding to beginners.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'JavaScript', level: 'expert', description: '6+ years experience' },
      { skill: 'React', level: 'expert', description: '4+ years experience' },
      { skill: 'Node.js', level: 'advanced', description: '5+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Arabic Language', level: 'beginner', priority: 'high' }
    ],
    availability: { status: 'busy', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 52, sessionsAttended: 18, averageRating: 4.7, totalRatings: 41 }
  },

  // Sinhalese Christian - Negombo
  {
    firstName: 'Dinesh',
    lastName: 'Fernando',
    email: 'dinesh.fernando@example.lk',
    password: hashedPassword,
    bio: 'Guitar instructor and music producer. Specialize in contemporary and gospel music.',
    location: 'Online',
    offeredSkills: [
      { skill: 'Guitar', level: 'expert', description: '12+ years experience' },
      { skill: 'Music Production', level: 'advanced', description: '7+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Piano', level: 'intermediate', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 89, sessionsAttended: 15, averageRating: 4.9, totalRatings: 76 }
  },

  // Tamil Christian - Kandy
  {
    firstName: 'Rebecca',
    lastName: 'Joseph',
    email: 'rebecca.joseph@example.lk',
    password: hashedPassword,
    bio: 'English language teacher and IELTS trainer. Help students achieve their language goals.',
    location: 'Kandy',
    offeredSkills: [
      { skill: 'English Language', level: 'expert', description: 'Native proficiency' },
      { skill: 'IELTS Preparation', level: 'expert', description: '8+ years experience' }
    ],
    desiredSkills: [
      { skill: 'French', level: 'beginner', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 134, sessionsAttended: 22, averageRating: 4.8, totalRatings: 98 }
  },

  // Sinhalese Buddhist - Kandy
  {
    firstName: 'Kasun',
    lastName: 'Wickramasinghe',
    email: 'kasun.wick@example.lk',
    password: hashedPassword,
    bio: 'Yoga instructor and mindfulness coach. Helping people find inner peace and physical wellness.',
    location: 'Kandy',
    offeredSkills: [
      { skill: 'Yoga', level: 'expert', description: '10+ years practice' },
      { skill: 'Meditation', level: 'advanced', description: '8+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Ayurveda', level: 'intermediate', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 156, sessionsAttended: 34, averageRating: 4.9, totalRatings: 123 }
  },

  // Tamil Muslim - Colombo
  {
    firstName: 'Aisha',
    lastName: 'Mohideen',
    email: 'aisha.mohideen@example.lk',
    password: hashedPassword,
    bio: 'Graphic designer and digital artist. Creating beautiful designs for brands and individuals.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Graphic Design', level: 'expert', description: '7+ years experience' },
      { skill: 'Adobe Illustrator', level: 'expert', description: '6+ years experience' },
      { skill: 'UI/UX Design', level: 'advanced', description: '4+ years experience' }
    ],
    desiredSkills: [
      { skill: '3D Modeling', level: 'beginner', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 78, sessionsAttended: 25, averageRating: 4.8, totalRatings: 62 }
  },

  // Burgher - Colombo
  {
    firstName: 'Brandon',
    lastName: 'Van Dort',
    email: 'brandon.vandort@example.lk',
    password: hashedPassword,
    bio: 'Chef and culinary instructor. Specialize in fusion cuisine blending Sri Lankan and Western flavors.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Cooking', level: 'expert', description: '15+ years experience' },
      { skill: 'Baking', level: 'advanced', description: '10+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Food Photography', level: 'beginner', priority: 'high' }
    ],
    availability: { status: 'busy', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 92, sessionsAttended: 14, averageRating: 4.9, totalRatings: 81 }
  },

  // Sinhalese Buddhist - Online
  {
    firstName: 'Chamari',
    lastName: 'Silva',
    email: 'chamari.silva@example.lk',
    password: hashedPassword,
    bio: 'Mathematics tutor for O/L and A/L students. Making math fun and easy to understand.',
    location: 'Online',
    offeredSkills: [
      { skill: 'Mathematics', level: 'expert', description: '12+ years teaching' },
      { skill: 'Physics', level: 'advanced', description: '8+ years teaching' }
    ],
    desiredSkills: [
      { skill: 'Educational Technology', level: 'intermediate', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 203, sessionsAttended: 8, averageRating: 4.9, totalRatings: 187 }
  },

  // Tamil Hindu - Kandy
  {
    firstName: 'Kumar',
    lastName: 'Ramesh',
    email: 'kumar.ramesh@example.lk',
    password: hashedPassword,
    bio: 'Digital marketing specialist. Help businesses grow their online presence.',
    location: 'Kandy',
    offeredSkills: [
      { skill: 'Digital Marketing', level: 'expert', description: '9+ years experience' },
      { skill: 'SEO', level: 'expert', description: '7+ years experience' },
      { skill: 'Social Media Marketing', level: 'advanced', description: '6+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Video Editing', level: 'intermediate', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 67, sessionsAttended: 29, averageRating: 4.7, totalRatings: 54 }
  },

  // Muslim - Kandy
  {
    firstName: 'Rizwan',
    lastName: 'Cassim',
    email: 'rizwan.cassim@example.lk',
    password: hashedPassword,
    bio: 'Business consultant and startup mentor. Passionate about helping entrepreneurs succeed.',
    location: 'Kandy',
    offeredSkills: [
      { skill: 'Business Strategy', level: 'expert', description: '11+ years experience' },
      { skill: 'Financial Planning', level: 'advanced', description: '8+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Public Speaking', level: 'intermediate', priority: 'high' }
    ],
    availability: { status: 'busy', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 43, sessionsAttended: 31, averageRating: 4.8, totalRatings: 38 }
  },

  // Sinhalese Christian - Colombo
  {
    firstName: 'Shanika',
    lastName: 'De Silva',
    email: 'shanika.desilva@example.lk',
    password: hashedPassword,
    bio: 'Interior designer creating beautiful, functional spaces. Love sustainable design.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Interior Design', level: 'expert', description: '9+ years experience' },
      { skill: 'AutoCAD', level: 'advanced', description: '7+ years experience' }
    ],
    desiredSkills: [
      { skill: '3D Rendering', level: 'advanced', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 56, sessionsAttended: 18, averageRating: 4.8, totalRatings: 47 }
  },

  // Tamil Christian - Online
  {
    firstName: 'Samuel',
    lastName: 'Jeyaraj',
    email: 'samuel.jeyaraj@example.lk',
    password: hashedPassword,
    bio: 'Web developer and coding bootcamp instructor. Making tech accessible to everyone.',
    location: 'Online',
    offeredSkills: [
      { skill: 'Python', level: 'expert', description: '8+ years experience' },
      { skill: 'Django', level: 'advanced', description: '5+ years experience' },
      { skill: 'Data Science', level: 'intermediate', description: '3+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Machine Learning', level: 'advanced', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 94, sessionsAttended: 41, averageRating: 4.9, totalRatings: 82 }
  },

  // Malay Muslim - Colombo
  {
    firstName: 'Zainab',
    lastName: 'Noordeen',
    email: 'zainab.noordeen@example.lk',
    password: hashedPassword,
    bio: 'Content writer and blogger. Specialize in travel, lifestyle, and cultural stories.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Content Writing', level: 'expert', description: '7+ years experience' },
      { skill: 'Blogging', level: 'expert', description: '6+ years experience' },
      { skill: 'Copywriting', level: 'advanced', description: '5+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Video Production', level: 'beginner', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 38, sessionsAttended: 22, averageRating: 4.7, totalRatings: 31 }
  },

  // Sinhalese Buddhist - Colombo
  {
    firstName: 'Sachini',
    lastName: 'Rajapaksha',
    email: 'sachini.raja@example.lk',
    password: hashedPassword,
    bio: 'Fashion designer and sewing instructor. Creating modern designs with traditional touches.',
    location: 'Colombo',
    offeredSkills: [
      { skill: 'Fashion Design', level: 'expert', description: '10+ years experience' },
      { skill: 'Sewing', level: 'expert', description: '12+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Fashion Photography', level: 'beginner', priority: 'high' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 71, sessionsAttended: 16, averageRating: 4.8, totalRatings: 63 }
  },

  // Tamil Hindu - Online
  {
    firstName: 'Anjali',
    lastName: 'Krishnan',
    email: 'anjali.krishnan@example.lk',
    password: hashedPassword,
    bio: 'Art teacher and painter. Teaching traditional and contemporary art techniques.',
    location: 'Online',
    offeredSkills: [
      { skill: 'Painting', level: 'expert', description: '14+ years experience' },
      { skill: 'Drawing', level: 'expert', description: '15+ years experience' },
      { skill: 'Art History', level: 'advanced', description: '8+ years study' }
    ],
    desiredSkills: [
      { skill: 'Digital Art', level: 'intermediate', priority: 'medium' }
    ],
    availability: { status: 'available', timezone: 'Asia/Colombo' },
    stats: { sessionsTaught: 112, sessionsAttended: 27, averageRating: 4.9, totalRatings: 95 }
  }
];

console.log('Adding Sri Lankan user profiles...');
console.log('');

let added = 0;
let skipped = 0;

for (const userData of sriLankanUsers) {
  try {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`⚠️  Exists: ${userData.firstName} ${userData.lastName} (${userData.email})`);
      skipped++;
    } else {
      await User.create(userData);
      console.log(`✅ Added: ${userData.firstName} ${userData.lastName} - ${userData.location} (${userData.offeredSkills[0].skill})`);
      added++;
    }
  } catch (error) {
    console.log(`❌ Error: ${userData.firstName} - ${error.message}`);
  }
}

console.log('');
console.log('========================================');
console.log('SUMMARY');
console.log('========================================');
console.log(`✅ Added: ${added} users`);
console.log(`⚠️  Skipped: ${skipped} (already exist)`);
console.log('');
console.log('Diversity Coverage:');
console.log('  ✅ Sinhalese (Buddhist, Christian)');
console.log('  ✅ Tamil (Hindu, Christian, Muslim)');
console.log('  ✅ Muslim (Sinhalese, Tamil, Malay)');
console.log('  ✅ Burgher');
console.log('');
console.log('Locations:');
console.log('  ✅ Colombo');
console.log('  ✅ Kandy');
console.log('  ✅ Online');
console.log('');
console.log('Skills:');
console.log('  ✅ Tech (Coding, Design, Marketing)');
console.log('  ✅ Arts (Music, Dance, Painting)');
console.log('  ✅ Education (Teaching, Languages)');
console.log('  ✅ Lifestyle (Cooking, Fashion, Yoga)');
console.log('========================================');

await mongoose.connection.close();
console.log('');
console.log('Database connection closed');
console.log('✅ Users ready for Explore page!');

