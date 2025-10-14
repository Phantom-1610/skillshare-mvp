import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillshare-secret-key-2024';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected - Sri Lankan SkillShare Database');
    } else {
      console.log('⚠️  MongoDB URI not found - Running in memory mode');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing in memory-only mode');
  }
};

connectDB();

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  offeredSkills: [{ 
    skill: String, 
    level: String, 
    description: String 
  }],
  desiredSkills: [{ 
    skill: String, 
    level: String, 
    priority: String 
  }],
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

// Message Schema for MongoDB
const MessageSchema = new mongoose.Schema({
  threadId: { type: String, required: true, index: true },
  sender: { type: String, required: true, index: true },
  recipient: { type: String, required: true, index: true },
  content: { type: String, required: true },
  type: { type: String, default: 'text', enum: ['text', 'image', 'file'] },
  status: { type: String, default: 'sent', enum: ['sent', 'delivered', 'read'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient queries
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ threadId: 1, createdAt: -1 });

const Message = mongoose.model('Message', MessageSchema);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// SRI LANKAN MATCHES - Only hardcoded data shown to users
const sriLankanMatches = [
  {
    id: 'match-1',
    firstName: 'Kasun',
    lastName: 'Perera',
    email: 'kasun.perera@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Software engineering student from University of Colombo. Love teaching React and learning Python!',
    location: 'Colombo 07, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '1', skill: 'React', level: 'advanced', description: '3+ years building web apps' },
      { id: '2', skill: 'JavaScript', level: 'expert', description: 'Full-stack development' }
    ],
    desiredSkills: [
      { id: '3', skill: 'Python', level: 'intermediate', priority: 'high' },
      { id: '4', skill: 'Machine Learning', level: 'beginner', priority: 'medium' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 12, sessionsAttended: 8, averageRating: 4.8, totalRatings: 15 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-2',
    firstName: 'Nilmini',
    lastName: 'Fernando',
    email: 'nilmini.fernando@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'UI/UX Designer and freelancer based in Kandy. Expert in Figma and Adobe XD!',
    location: 'Kandy, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '5', skill: 'UI/UX Design', level: 'expert', description: '5+ years experience' },
      { id: '6', skill: 'Figma', level: 'advanced', description: 'Professional projects' }
    ],
    desiredSkills: [
      { id: '7', skill: 'React', level: 'beginner', priority: 'high' },
      { id: '8', skill: 'Frontend Development', level: 'intermediate', priority: 'medium' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 18, sessionsAttended: 6, averageRating: 4.9, totalRatings: 20 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-3',
    firstName: 'Tharaka',
    lastName: 'Silva',
    email: 'tharaka.silva@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Python developer and data science enthusiast from Galle. Teaching programming for 2+ years.',
    location: 'Galle, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '9', skill: 'Python', level: 'expert', description: '6+ years experience' },
      { id: '10', skill: 'Data Science', level: 'advanced', description: 'ML & AI projects' }
    ],
    desiredSkills: [
      { id: '11', skill: 'React Native', level: 'beginner', priority: 'medium' },
      { id: '12', skill: 'Mobile Development', level: 'beginner', priority: 'low' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 25, sessionsAttended: 10, averageRating: 4.7, totalRatings: 28 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-4',
    firstName: 'Ayesha',
    lastName: 'Wickramasinghe',
    email: 'ayesha.w@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Marketing graduate learning web development. Love digital marketing and content creation!',
    location: 'Negombo, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '13', skill: 'Digital Marketing', level: 'advanced', description: 'SEO & Social Media' },
      { id: '14', skill: 'Content Writing', level: 'expert', description: 'Blog & copywriting' }
    ],
    desiredSkills: [
      { id: '15', skill: 'Web Development', level: 'beginner', priority: 'high' },
      { id: '16', skill: 'JavaScript', level: 'beginner', priority: 'high' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 8, sessionsAttended: 15, averageRating: 4.6, totalRatings: 10 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-5',
    firstName: 'Nuwan',
    lastName: 'Rajapaksa',
    email: 'nuwan.r@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Graphic designer and photographer from Jaffna. Specializing in branding and visual identity.',
    location: 'Jaffna, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '17', skill: 'Graphic Design', level: 'expert', description: 'Adobe Creative Suite' },
      { id: '18', skill: 'Photography', level: 'advanced', description: 'Product & portrait' }
    ],
    desiredSkills: [
      { id: '19', skill: 'Video Editing', level: 'intermediate', priority: 'medium' },
      { id: '20', skill: 'Motion Graphics', level: 'beginner', priority: 'low' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 14, sessionsAttended: 9, averageRating: 4.8, totalRatings: 16 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-6',
    firstName: 'Priyanka',
    lastName: 'Jayawardena',
    email: 'priyanka.j@email.lk',
    password: 'demo123',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Business student from SLIIT. Expert in financial analysis and Excel.',
    location: 'Malabe, Sri Lanka',
    profilePicture: '',
    offeredSkills: [
      { id: '21', skill: 'Excel', level: 'expert', description: 'Advanced formulas & pivot tables' },
      { id: '22', skill: 'Financial Analysis', level: 'advanced', description: 'Corporate finance' }
    ],
    desiredSkills: [
      { id: '23', skill: 'Python', level: 'beginner', priority: 'high' },
      { id: '24', skill: 'Data Visualization', level: 'beginner', priority: 'medium' }
    ],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 10, sessionsAttended: 12, averageRating: 4.7, totalRatings: 12 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  }
];

// Real users database - STARTS EMPTY except admin
let users = [
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'SkillShare',
    email: 'admin@skillshare.lk',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    isVerified: true,
    bio: 'SkillShare Platform Administrator',
    location: 'Colombo, Sri Lanka',
    profilePicture: '',
    offeredSkills: [],
    desiredSkills: [],
    availability: { timezone: 'Asia/Colombo', schedule: [] },
    stats: { sessionsTaught: 0, sessionsAttended: 0, averageRating: 0, totalRatings: 0 },
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  }
];

// EMPTY arrays - No hardcoded data
let messages = [];
let sessions = [];
let notifications = [];
let reviews = [];
let reports = [];
let skillVerifications = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId) || sriLankanMatches.find(u => u.id === decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const getPublicUser = (user) => {
  if (!user) return null;
  const { password, ...publicUser } = user;
  // Ensure id is set for MongoDB users
  if (publicUser._id && !publicUser.id) {
    publicUser.id = publicUser._id.toString();
  }
  return publicUser;
};

// Helper to get user from MongoDB or fallback
const getUserById = async (userId) => {
  if (!userId) return null;
  
  // Try MongoDB first
  if (mongoose.connection.readyState === 1) {
    try {
      const mongoUser = await User.findById(userId).select('-password');
      if (mongoUser) {
        const obj = mongoUser.toObject();
        obj.id = obj._id.toString();
        return obj;
      }
    } catch (error) {
      // Invalid MongoDB ID, try in-memory
    }
  }
  
  // Fallback to in-memory
  return users.find(u => u.id === userId) || sriLankanMatches.find(u => u.id === userId);
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length,
    sessions: sessions.length,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists in MongoDB or in-memory
    const existingUser = mongoose.connection.readyState === 1 
      ? await User.findOne({ email })
      : users.find(u => u.email === email) || sriLankanMatches.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let newUser;

    // Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const mongoUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isVerified: true,
        bio: '',
        location: '',
        profilePicture: '',
        offeredSkills: [],
        desiredSkills: [],
        availability: { 
          timezone: 'Asia/Colombo',
          schedule: []
        },
        stats: { 
          sessionsTaught: 0, 
          sessionsAttended: 0, 
          averageRating: 0, 
          totalRatings: 0 
        },
        followers: [],
        following: []
      });

      await mongoUser.save();
      newUser = mongoUser.toObject();
      newUser.id = newUser._id.toString();
      console.log(`✅ New user saved to MongoDB: ${email}`);
    } else {
      // Fallback to in-memory
      newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password: password,
        role: 'user',
        isActive: true,
        isVerified: true,
        bio: '',
        location: '',
        profilePicture: '',
        offeredSkills: [],
        desiredSkills: [],
        availability: { 
          timezone: 'Asia/Colombo',
          schedule: []
        },
        stats: { 
          sessionsTaught: 0, 
          sessionsAttended: 0, 
          averageRating: 0, 
          totalRatings: 0 
        },
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      console.log(`✅ New user registered (in-memory): ${email}`);
    }

    const token = generateToken(newUser.id);

    res.json({
      success: true,
      message: 'Welcome to SkillShare! Your profile is ready to customize.',
      data: {
        user: getPublicUser(newUser),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt: ${email}`);
    
    // Check MongoDB first if connected
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email, isActive: true }).lean();
      if (user) {
        user.id = user._id.toString();
        console.log(`✅ Found user in MongoDB: ${email}`);
      }
    }
    
    // Fallback to in-memory
    if (!user) {
      user = users.find(u => u.email === email) || sriLankanMatches.find(u => u.email === email);
      if (user) {
        console.log(`✅ Found user in memory: ${email}`);
      }
    }

    if (!user) {
      console.log(`❌ Login failed: User not found - ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.isActive === false) {
      console.log(`❌ Login failed: User inactive - ${email}`);
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Check password
    let isValidPassword = false;
    
    // If password starts with $2a or $2b, it's bcrypt hashed - need to compare
    if (user.password && user.password.startsWith('$2')) {
      // Hashed password - use bcrypt
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log(`🔐 Bcrypt password check for ${email}: ${isValidPassword ? 'PASS' : 'FAIL'}`);
    } else {
      // Plain text password (old demo users) - direct comparison
      isValidPassword = user.password === password;
      console.log(`🔐 Plain text password check for ${email}: ${isValidPassword ? 'PASS' : 'FAIL'}`);
    }

    if (!isValidPassword) {
      console.log(`❌ Login failed: Invalid password - ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`✅ Login successful: ${email}`);
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: getPublicUser(user),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: getPublicUser(req.user)
    }
  });
});

// User routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, skill, location } = req.query;
    
    let usersToShow = [];

    // Fetch from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const mongoUsers = await User.find({ 
        isActive: true,
        role: { $ne: 'admin' }
      }).select('-password');
      
      usersToShow = mongoUsers.map(u => {
        const obj = u.toObject();
        obj.id = obj._id.toString();
        return obj;
      });
    } else {
      // Fallback: Show Sri Lankan matches + real users
      usersToShow = [...sriLankanMatches];
      const realUsers = users.filter(u => u.id !== req.user.id && u.isActive && u.role !== 'admin');
      usersToShow = [...usersToShow, ...realUsers];
    }

    // Filter out current user
    usersToShow = usersToShow.filter(u => u.id !== req.user.id);
    
    // Apply filters
    if (search) {
      usersToShow = usersToShow.filter(u => 
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (skill) {
      usersToShow = usersToShow.filter(u => 
        u.offeredSkills?.some(s => s.skill?.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    
    if (location) {
      usersToShow = usersToShow.filter(u => 
        u.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = usersToShow.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers.map(getPublicUser),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: usersToShow.length,
          pages: Math.ceil(usersToShow.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    let user = null;
    
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const mongoUser = await User.findById(req.params.userId).select('-password');
      if (mongoUser) {
        const obj = mongoUser.toObject();
        obj.id = obj._id.toString();
        user = obj;
      }
    }
    
    // Fallback to in-memory
    if (!user) {
      user = users.find(u => u.id === req.params.userId) || sriLankanMatches.find(u => u.id === req.params.userId);
    }
    
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        user: getPublicUser(user)
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, bio, location, profilePicture, offeredSkills, desiredSkills } = req.body;
  
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update all fields at once (single form update)
  if (firstName !== undefined) users[userIndex].firstName = firstName;
  if (lastName !== undefined) users[userIndex].lastName = lastName;
  if (bio !== undefined) users[userIndex].bio = bio;
  if (location !== undefined) users[userIndex].location = location;
  if (profilePicture !== undefined) users[userIndex].profilePicture = profilePicture;
  if (offeredSkills !== undefined) users[userIndex].offeredSkills = offeredSkills;
  if (desiredSkills !== undefined) users[userIndex].desiredSkills = desiredSkills;

  console.log(`✅ Profile updated for: ${users[userIndex].email}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: getPublicUser(users[userIndex])
    }
  });
});

// Sessions routes - NO hardcoded data
app.get('/api/sessions', authenticateToken, (req, res) => {
  // Return ONLY real sessions for this user
  const userSessions = sessions.filter(s => 
    s.teacher === req.user.id || s.student === req.user.id
  );

  res.json({
    success: true,
    data: {
      sessions: userSessions,
      pagination: {
        page: 1,
        limit: 10,
        total: userSessions.length,
        pages: 1
      }
    }
  });
});

app.post('/api/sessions', authenticateToken, (req, res) => {
  const { title, description, skill, teacherId, scheduledAt, duration } = req.body;

  const newSession = {
    id: Date.now().toString(),
    title,
    description,
    skill,
    teacher: teacherId,
    student: req.user.id,
    scheduledAt,
    duration: duration || 60,
    status: 'scheduled',
    meetingUrl: `http://localhost:3000/app/video/session-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);

  res.json({
    success: true,
    message: 'Session booked successfully',
    data: { session: newSession }
  });
});

// Message routes - MongoDB Integration
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const threadId = `thread_${Math.min(req.user.id, req.params.userId)}_${Math.max(req.user.id, req.params.userId)}`;
    
    let threadMessages = [];
    
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      threadMessages = await Message.find({ threadId })
        .sort({ createdAt: 1 })
        .lean();
      
      console.log(`✅ Loaded ${threadMessages.length} messages from MongoDB for thread: ${threadId}`);
    } else {
      // Fallback to in-memory
      threadMessages = messages.filter(m => m.threadId === threadId);
      console.log(`⚠️  Using in-memory: ${threadMessages.length} messages for thread: ${threadId}`);
    }

    const messagesWithUsers = await Promise.all(threadMessages.map(async (message) => ({
      ...message,
      id: message._id?.toString() || message.id,
      sender: getPublicUser(await getUserById(message.sender)),
      recipient: getPublicUser(await getUserById(message.recipient))
    })));

    res.json({
      success: true,
      data: {
        messages: messagesWithUsers
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all conversations for sidebar - MongoDB Integration
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const conversations = new Map();
    let allMessages = [];
    
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      // Get all messages where user is sender or recipient
      allMessages = await Message.find({
        $or: [
          { sender: req.user.id },
          { recipient: req.user.id }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();
      
      console.log(`✅ Loaded ${allMessages.length} messages from MongoDB for conversations`);
    } else {
      // Fallback to in-memory
      allMessages = [...messages].filter(m => 
        m.sender === req.user.id || m.recipient === req.user.id
      );
      console.log(`⚠️  Using in-memory: ${allMessages.length} messages`);
    }
    
    // Group by conversation partner
    for (const msg of allMessages) {
      const partnerId = msg.sender === req.user.id ? msg.recipient : msg.sender;
      
      // Only set if this partner doesn't exist yet (ensures we get the LATEST message)
      if (!conversations.has(partnerId)) {
        const partner = await getUserById(partnerId);
        if (partner) {
          const sender = await getUserById(msg.sender);
          const recipient = await getUserById(msg.recipient);
          
          conversations.set(partnerId, {
            id: partnerId,
            user: getPublicUser(partner),
            lastMessage: {
              ...msg,
              id: msg._id?.toString() || msg.id,
              sender: getPublicUser(sender),
              recipient: getPublicUser(recipient)
            },
            unreadCount: msg.sender !== req.user.id && msg.status !== 'read' ? 1 : 0
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        conversations: Array.from(conversations.values())
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Send a new message - SAVES TO MONGODB
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { recipientId, content, type = 'text' } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }

    const threadId = `thread_${Math.min(req.user.id, recipientId)}_${Math.max(req.user.id, recipientId)}`;
    
    let savedMessage;
    
    // Save to MongoDB if available
    if (mongoose.connection.readyState === 1) {
      const newMessage = new Message({
        threadId,
        sender: req.user.id,
        recipient: recipientId,
        content,
        type,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      savedMessage = await newMessage.save();
      console.log(`✅ Message saved to MongoDB: ${req.user.firstName} → Recipient ${recipientId}`);
      
      // Also save to in-memory for Socket.IO
      messages.push({
        id: savedMessage._id.toString(),
        threadId: savedMessage.threadId,
        sender: savedMessage.sender,
        recipient: savedMessage.recipient,
        content: savedMessage.content,
        type: savedMessage.type,
        status: savedMessage.status,
        createdAt: savedMessage.createdAt.toISOString()
      });
    } else {
      // Fallback to in-memory only
      savedMessage = {
        id: Date.now().toString(),
        threadId,
        sender: req.user.id,
        recipient: recipientId,
        content,
        type,
        status: 'sent',
        createdAt: new Date().toISOString()
      };
      
      messages.push(savedMessage);
      console.log(`⚠️  Message saved to memory: ${req.user.firstName} → Recipient ${recipientId}`);
    }

    // Emit socket event for real-time delivery
    const recipient = await getUserById(recipientId);
    io.to(recipientId).emit('new-message', {
      ...savedMessage,
      id: savedMessage._id?.toString() || savedMessage.id,
      sender: getPublicUser(req.user),
      recipient: getPublicUser(recipient)
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: { 
        message: {
          ...savedMessage,
          id: savedMessage._id?.toString() || savedMessage.id,
          sender: getPublicUser(req.user)
        }
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Notifications routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.user.id);
  
  res.json({
    success: true,
    data: {
      notifications: userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  });
});

app.post('/api/notifications', authenticateToken, (req, res) => {
  const { userId, type, message } = req.body;
  
  const notification = {
    id: Date.now().toString(),
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(notification);
  
  res.json({
    success: true,
    data: { notification }
  });
});

// Skill Verification routes
app.post('/api/users/skill-verification', authenticateToken, (req, res) => {
  const { skill, verificationType, fileUrl, description } = req.body;
  
  const verification = {
    id: Date.now().toString(),
    userId: req.user.id,
    skill,
    verificationType,
    fileUrl,
    description,
    verified: false,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: new Date().toISOString()
  };
  
  skillVerifications.push(verification);
  
  // Add to user's profile
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) {
    if (!users[userIndex].skillVerifications) {
      users[userIndex].skillVerifications = [];
    }
    users[userIndex].skillVerifications.push(verification);
  }
  
  res.json({
    success: true,
    message: 'Verification submitted successfully',
    data: { verification }
  });
});

// Review/Rating routes
app.post('/api/reviews', authenticateToken, (req, res) => {
  const { revieweeId, rating, comment } = req.body;
  
  const review = {
    id: Date.now().toString(),
    reviewerId: req.user.id,
    revieweeId,
    rating: parseFloat(rating),
    comment,
    createdAt: new Date().toISOString()
  };
  
  reviews.push(review);
  
  // Update user stats
  const userIndex = users.findIndex(u => u.id === revieweeId);
  if (userIndex !== -1) {
    const userReviews = reviews.filter(r => r.revieweeId === revieweeId);
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    
    users[userIndex].stats.averageRating = avgRating;
    users[userIndex].stats.totalRatings = userReviews.length;
  }
  
  res.json({
    success: true,
    message: 'Review submitted successfully',
    data: { review }
  });
});

app.get('/api/reviews/:userId', async (req, res) => {
  try {
    const userReviews = reviews.filter(r => r.revieweeId === req.params.userId);
    
    const reviewsWithReviewer = await Promise.all(userReviews.map(async (review) => ({
      ...review,
      reviewer: getPublicUser(await getUserById(review.reviewerId))
    })));
    
    res.json({
      success: true,
      data: { reviews: reviewsWithReviewer }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Report routes
app.post('/api/reports', authenticateToken, (req, res) => {
  const { reportedUserId, reason, description } = req.body;
  
  const report = {
    id: Date.now().toString(),
    reporterId: req.user.id,
    reportedUserId,
    reason,
    description,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  reports.push(report);
  
  res.json({
    success: true,
    message: 'Report submitted successfully. Our team will review it.',
    data: { report }
  });
});

// Socket.io setup
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;
    
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const mongoUser = await User.findById(decoded.userId).select('-password');
      if (mongoUser) {
        const obj = mongoUser.toObject();
        obj.id = obj._id.toString();
        user = obj;
      }
    }
    
    // Fallback to in-memory
    if (!user) {
      user = users.find(u => u.id === decoded.userId) || sriLankanMatches.find(u => u.id === decoded.userId);
    }
    
    if (user && user.isActive) {
      socket.userId = user.id;
      socket.user = user;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User ${socket.user.firstName} connected: ${socket.id}`);

  socket.join(`user_${socket.userId}`);

  // Real-time messaging (like Facebook!)
  socket.on('send_message', (data) => {
    const { recipientId, content, type = 'text' } = data;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: socket.userId,
      recipient: recipientId,
      content,
      type,
      status: 'sent',
      threadId: `thread_${Math.min(socket.userId, recipientId)}_${Math.max(socket.userId, recipientId)}`,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);

    // Send to recipient
    socket.to(`user_${recipientId}`).emit('new_message', {
      message: {
        ...newMessage,
        sender: getPublicUser(socket.user)
      }
    });

    // Confirm to sender
    socket.emit('message_sent', {
      message: newMessage
    });
  });

  socket.on('join_session', (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && (session.teacher === socket.userId || session.student === socket.userId)) {
      socket.join(`session_${sessionId}`);
      socket.emit('joined_session', { sessionId, session });
    }
  });

  socket.on('disconnect', () => {
    console.log(`👋 User ${socket.user?.firstName} disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('🚀 SkillShare Backend Server Running!');
  console.log('=====================================');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 CORS: http://localhost:3000`);
  console.log(`🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️  Memory Mode'}`);
  console.log(`📍 Location: Sri Lanka (Asia/Colombo)`);
  console.log('');
  console.log('✅ New User Registration: NO fake data!');
  console.log('✅ Matches Section: Sri Lankan users only!');
  console.log('✅ Chat & Sessions: Empty until users interact!');
  console.log('');
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('=====================================');
});

export default app;