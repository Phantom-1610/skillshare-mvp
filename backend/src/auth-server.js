import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshare';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MONGODB SCHEMAS
// ============================================

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
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
    status: { type: String, default: 'available', enum: ['available', 'busy', 'unavailable'] },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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

MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ threadId: 1, createdAt: -1 });

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

// ============================================
// CONNECT TO MONGODB
// ============================================

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const getPublicUser = (user) => {
  if (!user) return null;
  
  const userObj = user.toObject ? user.toObject() : user;
  const { password, __v, ...publicUser } = userObj;
  
  // Ensure id field exists
  if (userObj._id && !publicUser.id) {
    publicUser.id = userObj._id.toString();
  }
  
  return publicUser;
};

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: mongoose.connection.name
  });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate token
    const token = generateToken(newUser._id.toString());

    console.log(`✅ User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: getPublicUser(newUser),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Login attempt: ${email}`);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if active
    if (!user.isActive) {
      console.log(`❌ User inactive: ${email}`);
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    console.log(`✅ Login successful: ${email}`);

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
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET CURRENT USER
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: getPublicUser(req.user)
    }
  });
});

// LOGOUT (client-side only, but endpoint for consistency)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ============================================
// USER ROUTES
// ============================================

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({
      isActive: true,
      _id: { $ne: req.user._id }
    }).select('-password');

    const publicUsers = users.map(u => getPublicUser(u));

    res.json({
      success: true,
      data: {
        users: publicUsers
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
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

// ============================================
// MESSAGE ROUTES
// ============================================

app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;
    
    const threadId = `thread_${[currentUserId, otherUserId].sort().join('_')}`;
    
    const threadMessages = await Message.find({ threadId }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: {
        messages: threadMessages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    
    const allMessages = await Message.find({
      $or: [
        { sender: currentUserId },
        { recipient: currentUserId }
      ]
    }).sort({ createdAt: -1 });
    
    const conversations = new Map();
    
    for (const msg of allMessages) {
      const partnerId = msg.sender === currentUserId ? msg.recipient : msg.sender;
      
      if (!conversations.has(partnerId)) {
        const partner = await User.findById(partnerId).select('-password');
        if (partner) {
          conversations.set(partnerId, {
            id: partnerId,
            user: getPublicUser(partner),
            lastMessage: msg,
            unreadCount: 0
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

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { recipientId, content, type = 'text' } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }

    const currentUserId = req.user._id.toString();
    const threadId = `thread_${[currentUserId, recipientId].sort().join('_')}`;
    
    const newMessage = await Message.create({
      threadId,
      sender: currentUserId,
      recipient: recipientId,
      content,
      type,
      status: 'sent'
    });

    console.log(`✅ Message saved: ${req.user.email} → ${recipientId}`);

    // Emit socket event
    io.to(recipientId).emit('new-message', newMessage);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: { message: newMessage }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============================================
// SOCKET.IO
// ============================================

io.on('connection', (socket) => {
  console.log('📱 Client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('📴 Client disconnected:', socket.id);
  });
});

// ============================================
// START SERVER
// ============================================

server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('✅ SKILLSHARE BACKEND RUNNING');
  console.log('========================================');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: Fully functional with MongoDB`);
  console.log('========================================');
  console.log('');
});

export default app;


