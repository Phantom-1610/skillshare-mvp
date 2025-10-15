const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'skillshare-secret-key-2024';

// In-memory database
let users = [
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
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
    skillVerifications: [],
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
  }
];

let sessions = [];
let matches = [];
let messages = [];
let reviews = [];

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const getPublicUser = (user) => {
  const { password, ...publicUser } = user;
  return publicUser;
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length,
    sessions: sessions.length
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password, // In production, hash this
      role: 'user',
      isActive: true,
      isVerified: true,
      bio: '',
      location: '',
      profilePicture: '',
      offeredSkills: [],
      desiredSkills: [],
      skillVerifications: [],
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
    const token = generateToken(newUser.id);

    res.json({
      success: true,
      message: 'User registered successfully',
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

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check for demo
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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
app.get('/api/users', authenticateToken, (req, res) => {
  const publicUsers = users
    .filter(u => u.id !== req.user.id && u.role !== 'admin')
    .map(getPublicUser);
  
  res.json({
    success: true,
    data: { users: publicUsers }
  });
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    success: true,
    data: { user: getPublicUser(user) }
  });
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const { bio, location, offeredSkills, desiredSkills, availability } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (bio !== undefined) users[userIndex].bio = bio;
    if (location !== undefined) users[userIndex].location = location;
    if (offeredSkills !== undefined) users[userIndex].offeredSkills = offeredSkills;
    if (desiredSkills !== undefined) users[userIndex].desiredSkills = desiredSkills;
    if (availability !== undefined) users[userIndex].availability = availability;

    res.json({
      success: true,
      data: { user: getPublicUser(users[userIndex]) }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Skill verification upload
app.post('/api/users/skill-verification', authenticateToken, (req, res) => {
  try {
    const { skill, verificationType, fileUrl, description } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verification = {
      id: Date.now().toString(),
      skill,
      verificationType, // 'certificate', 'portfolio', 'photo'
      fileUrl,
      description,
      verified: false,
      createdAt: new Date().toISOString()
    };

    if (!users[userIndex].skillVerifications) {
      users[userIndex].skillVerifications = [];
    }
    users[userIndex].skillVerifications.push(verification);

    res.json({
      success: true,
      data: { verification }
    });
  } catch (error) {
    console.error('Skill verification error:', error);
    res.status(500).json({ error: 'Skill verification failed' });
  }
});

// Matches routes
app.get('/api/matches', authenticateToken, (req, res) => {
  const userMatches = matches.filter(m => 
    m.users.includes(req.user.id)
  );
  
  res.json({
    success: true,
    data: { matches: userMatches }
  });
});

app.post('/api/matches', authenticateToken, (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    const newMatch = {
      id: Date.now().toString(),
      users: [req.user.id, targetUserId],
      status: 'pending',
      initiatedBy: req.user.id,
      score: 85,
      reasons: ['Complementary skills', 'Similar interests'],
      createdAt: new Date().toISOString()
    };

    matches.push(newMatch);

    res.json({
      success: true,
      data: { match: newMatch }
    });
  } catch (error) {
    console.error('Match creation error:', error);
    res.status(500).json({ error: 'Match creation failed' });
  }
});

// Sessions routes
app.get('/api/sessions', authenticateToken, (req, res) => {
  const userSessions = sessions.filter(s => 
    s.teacher === req.user.id || s.student === req.user.id
  );
  
  res.json({
    success: true,
    data: { sessions: userSessions }
  });
});

app.post('/api/sessions', authenticateToken, (req, res) => {
  try {
    const { title, description, studentId, scheduledAt, duration, mode } = req.body;
    
    const newSession = {
      id: Date.now().toString(),
      title,
      description,
      teacher: req.user.id,
      student: studentId,
      scheduledAt,
      duration: duration || 60,
      mode: mode || 'online',
      status: 'scheduled',
      roomId: `session-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);

    res.json({
      success: true,
      data: { session: newSession }
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: 'Session creation failed' });
  }
});

// Messages routes
app.get('/api/messages/:userId', authenticateToken, (req, res) => {
  const conversation = messages.filter(m => 
    (m.sender === req.user.id && m.receiver === req.params.userId) ||
    (m.sender === req.params.userId && m.receiver === req.user.id)
  );
  
  res.json({
    success: true,
    data: { messages: conversation }
  });
});

app.post('/api/messages', authenticateToken, (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: req.user.id,
      receiver: receiverId,
      content,
      read: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);

    // Emit via socket
    io.to(`user_${receiverId}`).emit('new_message', newMessage);

    res.json({
      success: true,
      data: { message: newMessage }
    });
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ error: 'Message send failed' });
  }
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ SkillShare Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🕐 Timezone: Asia/Colombo (Sri Lanka)`);
});

