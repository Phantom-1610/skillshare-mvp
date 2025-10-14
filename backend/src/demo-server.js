import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// In-memory demo data
const demoUsers = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Software developer with 5+ years of experience',
    location: 'New York, NY',
    offeredSkills: [
      { skill: 'JavaScript', level: 'advanced', description: '5+ years experience' },
      { skill: 'React', level: 'intermediate', description: '3+ years experience' }
    ],
    desiredSkills: [
      { skill: 'Python', level: 'beginner', priority: 'high' },
      { skill: 'Machine Learning', level: 'intermediate', priority: 'medium' }
    ],
    stats: {
      sessionsTaught: 10,
      sessionsAttended: 5,
      averageRating: 4.8,
      totalRatings: 15
    }
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: 'Data scientist and Python enthusiast',
    location: 'San Francisco, CA',
    offeredSkills: [
      { skill: 'Python', level: 'expert', description: '7+ years experience' },
      { skill: 'Machine Learning', level: 'advanced', description: '4+ years experience' }
    ],
    desiredSkills: [
      { skill: 'JavaScript', level: 'intermediate', priority: 'high' },
      { skill: 'React', level: 'beginner', priority: 'medium' }
    ],
    stats: {
      sessionsTaught: 15,
      sessionsAttended: 8,
      averageRating: 4.9,
      totalRatings: 23
    }
  }
];

const demoSessions = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming',
    teacher: demoUsers[0],
    student: demoUsers[1],
    skill: 'JavaScript',
    skillLevel: 'beginner',
    scheduledAt: '2024-01-15T14:00:00.000Z',
    duration: 60,
    type: 'online',
    videoRoomId: 'demo-room-1',
    status: 'scheduled'
  }
];

const demoMatches = [
  {
    _id: '1',
    user1: demoUsers[0],
    user2: demoUsers[1],
    skill: 'JavaScript',
    matchType: 'skill-exchange',
    score: 85,
    reasons: ['skill_match', 'level_compatibility', 'availability_overlap'],
    status: 'accepted'
  }
];

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'demo'
  });
});

// Demo API endpoints
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: {
      users: demoUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: demoUsers.length,
        pages: 1
      }
    }
  });
});

app.get('/api/users/:userId', (req, res) => {
  const user = demoUsers.find(u => u._id === req.params.userId);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  res.json({
    success: true,
    data: { user }
  });
});

app.get('/api/sessions', (req, res) => {
  res.json({
    success: true,
    data: {
      sessions: demoSessions,
      pagination: {
        page: 1,
        limit: 10,
        total: demoSessions.length,
        pages: 1
      }
    }
  });
});

app.get('/api/matches', (req, res) => {
  res.json({
    success: true,
    data: {
      matches: demoMatches,
      pagination: {
        page: 1,
        limit: 10,
        total: demoMatches.length,
        pages: 1
      }
    }
  });
});

// Demo auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo login - accept any email/password
  const user = demoUsers.find(u => u.email === email) || demoUsers[0];
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token: 'demo-jwt-token'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email } = req.body;
  
  const newUser = {
    _id: Date.now().toString(),
    firstName,
    lastName,
    email,
    role: 'user',
    isActive: true,
    isVerified: true,
    bio: '',
    location: '',
    offeredSkills: [],
    desiredSkills: [],
    stats: {
      sessionsTaught: 0,
      sessionsAttended: 0,
      averageRating: 0,
      totalRatings: 0
    }
  };
  
  demoUsers.push(newUser);
  
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      },
      token: 'demo-jwt-token'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: demoUsers[0]
    }
  });
});

// Setup Socket.io handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    // Echo back the message
    socket.emit('new_message', {
      message: {
        _id: Date.now().toString(),
        sender: { firstName: 'Demo', lastName: 'User' },
        content: data.content,
        createdAt: new Date().toISOString()
      },
      threadId: 'demo-thread'
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 SkillShare Demo Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: demo mode`);
  console.log(`💡 This is a demo version - MongoDB not required`);
});

export default app;
