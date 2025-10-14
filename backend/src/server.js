import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"] }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillshare-secret-key-2024';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshare')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  offeredSkills: [{ skill: String, level: String, description: String, verificationDoc: String }],
  desiredSkills: [{ skill: String, level: String, priority: String }],
  verificationDocs: [String],
  availability: {
    timezone: { type: String, default: 'Asia/Colombo' },
    status: String,
    schedule: [Object]
  },
  sessionsAttended: { type: Number, default: 0 },
  sessionsTaught: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  stats: {
    sessionsTaught: { type: Number, default: 0 },
    sessionsAttended: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  followers: [String],
  following: [String],
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  threadId: { type: String, index: true },
  sender: { type: String, index: true },
  recipient: { type: String, index: true },
  content: String,
  type: { type: String, default: 'text' },
  status: { type: String, default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  title: String,
  description: String,
  skill: String,
  teacher: String,
  student: String,
  scheduledAt: Date,
  duration: Number,
  status: { type: String, default: 'scheduled' },
  meetingUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  type: String,
  message: String,
  read: { type: Boolean, default: false },
  relatedId: String,
  createdAt: { type: Date, default: Date.now }
});

const MatchRequestSchema = new mongoose.Schema({
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
  message: String,
  createdAt: { type: Date, default: Date.now },
  respondedAt: Date
});

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  reviewerId: { type: String, required: true, index: true },
  reviewerName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const Session = mongoose.model('Session', SessionSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const MatchRequest = mongoose.model('MatchRequest', MatchRequestSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG, GIF) and PDFs are allowed!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded files

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper
const publicUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  obj.id = obj._id?.toString() || obj.id;
  delete obj._id;
  return obj;
};

// Routes
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// AUTH
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bio: '',
      location: '',
      offeredSkills: [],
      desiredSkills: [],
      availability: { timezone: 'Asia/Colombo', schedule: [] },
      stats: { sessionsTaught: 0, sessionsAttended: 0, averageRating: 0, totalRatings: 0 }
    });
    
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Welcome to SkillShare!',
      data: { user: publicUser(user), token }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: { user: publicUser(user), token }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: { user: publicUser(user) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// USERS
app.get('/api/users', auth, async (req, res) => {
  try {
    const { search, skill, location } = req.query;
    const query = { isActive: true, role: 'user', _id: { $ne: req.userId } };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    if (skill) query['offeredSkills.skill'] = { $regex: skill, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    
    const users = await User.find(query).select('-password').limit(50);
    res.json({
      success: true,
      data: { users: users.map(publicUser) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: { user: publicUser(user) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, data: { user: publicUser(user) } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/users/upload', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { type } = req.body;
      console.log(`Uploading ${type}:`, req.file.filename);
      
      const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      
      const user = await User.findById(req.userId);
      if (!user) {
        // Delete uploaded file if user not found
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'User not found' });
      }

      if (type === 'avatar') {
        // Delete old avatar file if exists
        if (user.avatar && user.avatar.includes('localhost')) {
          const oldFilename = user.avatar.split('/').pop();
          const oldPath = path.join(uploadsDir, oldFilename);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('Deleted old avatar:', oldFilename);
          }
        }
        user.avatar = fileUrl;
        user.profilePicture = fileUrl;
      } else if (type === 'verification') {
        if (!user.verificationDocs) user.verificationDocs = [];
        user.verificationDocs.push(fileUrl);
        console.log('Added verification doc:', fileUrl);
      } else {
        // Delete uploaded file if invalid type
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Invalid upload type. Use "avatar" or "verification".' });
      }
      
      await user.save();
      console.log(`Successfully uploaded ${type} for user:`, user.email);
      
      res.json({ 
        success: true, 
        message: `${type === 'avatar' ? 'Profile picture' : 'Document'} uploaded successfully`,
        data: { user: publicUser(user), fileUrl } 
      });
    } catch (err) {
      console.error('Upload processing error:', err);
      // Delete uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
  });
});

app.get('/api/users/:userId/stats', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Count sessions
    const sessionsAttended = await Session.countDocuments({ student: userId, status: 'completed' });
    const sessionsTaught = await Session.countDocuments({ teacher: userId, status: 'completed' });
    
    // Get reviews and calculate rating
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    res.json({
      success: true,
      data: {
        sessionsAttended,
        sessionsTaught,
        rating: avgRating,
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/users/:userId/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewer = await User.findById(req.userId);
    
    const review = await Review.create({
      userId: req.params.userId,
      reviewerId: req.userId,
      reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
      rating,
      comment
    });
    
    // Update user's average rating
    const allReviews = await Review.find({ userId: req.params.userId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(req.params.userId, {
      rating: avgRating,
      'stats.averageRating': avgRating,
      'stats.totalRatings': allReviews.length
    });
    
    res.json({ success: true, data: { review } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// DELETE ACCOUNT - Complete removal
app.delete('/api/users/account', auth, async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`🗑️ Deleting account for user: ${userId}`);
    
    // Get user data first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete all uploaded files
    const filesToDelete = [];
    if (user.avatar && user.avatar.includes('localhost')) {
      filesToDelete.push(user.avatar.split('/').pop());
    }
    if (user.profilePicture && user.profilePicture.includes('localhost')) {
      filesToDelete.push(user.profilePicture.split('/').pop());
    }
    if (user.verificationDocs) {
      user.verificationDocs.forEach(doc => {
        if (doc.includes('localhost')) {
          filesToDelete.push(doc.split('/').pop());
        }
      });
    }
    
    // Delete files from disk
    filesToDelete.forEach(filename => {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`📁 Deleted file: ${filename}`);
      }
    });
    
    // Delete all related data from database
    await Promise.all([
      // Delete messages sent by user
      Message.deleteMany({ sender: userId }),
      // Delete messages received by user
      Message.deleteMany({ recipient: userId }),
      // Delete sessions as teacher
      Session.deleteMany({ teacher: userId }),
      // Delete sessions as student
      Session.deleteMany({ student: userId }),
      // Delete match requests sent
      MatchRequest.deleteMany({ senderId: userId }),
      // Delete match requests received
      MatchRequest.deleteMany({ receiverId: userId }),
      // Delete notifications
      Notification.deleteMany({ userId: userId }),
      // Delete reviews written by user
      Review.deleteMany({ reviewerId: userId }),
      // Delete reviews about user
      Review.deleteMany({ userId: userId })
    ]);
    
    console.log(`🗑️ Deleted all related data for user: ${userId}`);
    
    // Finally, delete the user account
    await User.findByIdAndDelete(userId);
    
    console.log(`✅ Account completely deleted: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: 'Account and all associated data deleted successfully' 
    });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// MATCH REQUESTS
app.post('/api/match-requests', auth, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    
    // Check if request already exists
    const existing = await MatchRequest.findOne({
      $or: [
        { senderId: req.userId, receiverId },
        { senderId: receiverId, receiverId: req.userId }
      ]
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Match request already exists' });
    }
    
    const matchRequest = await MatchRequest.create({
      senderId: req.userId,
      receiverId,
      message: message || '',
      status: 'pending'
    });
    
    // Get sender info
    const sender = await User.findById(req.userId);
    
    // Create notification
    await Notification.create({
      userId: receiverId,
      type: 'match_request',
      message: `${sender.firstName} ${sender.lastName} wants to match with you`,
      relatedId: req.userId
    });
    
    // Emit real-time notification
    io.to(receiverId).emit('new-notification', {
      type: 'match_request',
      message: `${sender.firstName} ${sender.lastName} wants to match with you`,
      relatedId: req.userId
    });
    
    res.json({ success: true, message: 'Match request sent', data: { matchRequest } });
  } catch (err) {
    console.error('Match request error:', err);
    res.status(500).json({ error: 'Failed to send match request' });
  }
});

app.get('/api/match-requests', auth, async (req, res) => {
  try {
    // Get received requests (pending)
    const received = await MatchRequest.find({
      receiverId: req.userId,
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    // Get sent requests (pending)
    const sent = await MatchRequest.find({
      senderId: req.userId,
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    // Get accepted matches
    const accepted = await MatchRequest.find({
      $or: [
        { senderId: req.userId, status: 'accepted' },
        { receiverId: req.userId, status: 'accepted' }
      ]
    }).sort({ respondedAt: -1 });
    
    // Populate user data
    const receivedWithUsers = await Promise.all(received.map(async (req) => {
      const sender = await User.findById(req.senderId).select('-password');
      return {
        id: req._id.toString(),
        sender: publicUser(sender),
        message: req.message,
        createdAt: req.createdAt,
        status: req.status
      };
    }));
    
    const sentWithUsers = await Promise.all(sent.map(async (req) => {
      const receiver = await User.findById(req.receiverId).select('-password');
      return {
        id: req._id.toString(),
        receiver: publicUser(receiver),
        message: req.message,
        createdAt: req.createdAt,
        status: req.status
      };
    }));
    
    const acceptedWithUsers = await Promise.all(accepted.map(async (req) => {
      const otherId = req.senderId === req.userId ? req.receiverId : req.senderId;
      const other = await User.findById(otherId).select('-password');
      return {
        id: req._id.toString(),
        user: publicUser(other),
        matchedAt: req.respondedAt,
        status: req.status
      };
    }));
    
    res.json({
      success: true,
      data: {
        received: receivedWithUsers,
        sent: sentWithUsers,
        matches: acceptedWithUsers
      }
    });
  } catch (err) {
    console.error('Fetch match requests error:', err);
    res.status(500).json({ error: 'Failed to fetch match requests' });
  }
});

app.put('/api/match-requests/:id/accept', auth, async (req, res) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id);
    if (!matchRequest) return res.status(404).json({ error: 'Match request not found' });
    if (matchRequest.receiverId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    
    matchRequest.status = 'accepted';
    matchRequest.respondedAt = new Date();
    await matchRequest.save();
    
    // Get receiver info
    const receiver = await User.findById(req.userId);
    
    // Create notification for sender
    await Notification.create({
      userId: matchRequest.senderId,
      type: 'match_accepted',
      message: `${receiver.firstName} ${receiver.lastName} accepted your match request`,
      relatedId: req.userId
    });
    
    // Emit real-time notification
    io.to(matchRequest.senderId).emit('new-notification', {
      type: 'match_accepted',
      message: `${receiver.firstName} ${receiver.lastName} accepted your match request`,
      relatedId: req.userId
    });
    
    res.json({ success: true, message: 'Match request accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept match request' });
  }
});

app.put('/api/match-requests/:id/reject', auth, async (req, res) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id);
    if (!matchRequest) return res.status(404).json({ error: 'Match request not found' });
    if (matchRequest.receiverId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    
    matchRequest.status = 'rejected';
    matchRequest.respondedAt = new Date();
    await matchRequest.save();
    
    res.json({ success: true, message: 'Match request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject match request' });
  }
});

// MESSAGES
app.get('/api/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { recipient: req.userId }]
    }).sort({ createdAt: -1 });
    
    const conversations = new Map();
    for (const msg of messages) {
      const partnerId = msg.sender === req.userId ? msg.recipient : msg.sender;
      if (!conversations.has(partnerId)) {
        const partner = await User.findById(partnerId).select('-password');
        if (partner) {
          conversations.set(partnerId, {
            id: partnerId,
            user: publicUser(partner),
            lastMessage: {
              id: msg._id.toString(),
              content: msg.content,
              sender: msg.sender,
              recipient: msg.recipient,
              createdAt: msg.createdAt,
              status: msg.status
            },
            unreadCount: 0
          });
        }
      }
    }
    
    res.json({ success: true, data: { conversations: Array.from(conversations.values()) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/messages/:userId', auth, async (req, res) => {
  try {
    const threadId = `thread_${[req.userId, req.params.userId].sort().join('_')}`;
    const messages = await Message.find({ threadId }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: {
        messages: messages.map(m => ({
          id: m._id.toString(),
          content: m.content,
          sender: m.sender,
          recipient: m.recipient,
          type: m.type,
          status: m.status,
          createdAt: m.createdAt
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', auth, async (req, res) => {
  try {
    const { recipientId, content, type = 'text' } = req.body;
    const threadId = `thread_${[req.userId, recipientId].sort().join('_')}`;
    
    const message = await Message.create({
      threadId,
      sender: req.userId,
      recipient: recipientId,
      content,
      type,
      status: 'sent'
    });
    
    const sender = await User.findById(req.userId);
    
    await Notification.create({
      userId: recipientId,
      type: 'message',
      message: `${sender.firstName} ${sender.lastName} sent you a message`,
      relatedId: req.userId,
      read: false
    });
    
    io.to(recipientId).emit('new-message', {
      id: message._id.toString(),
      content: message.content,
      sender: req.userId,
      recipient: recipientId,
      createdAt: message.createdAt
    });
    
    io.to(recipientId).emit('new-notification', {
      type: 'message',
      message: `${sender.firstName} ${sender.lastName} sent you a message`,
      relatedId: req.userId
    });
    
    res.json({ success: true, message: 'Message sent', data: { message } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// SESSIONS
app.get('/api/sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.userId }, { student: req.userId }]
    }).sort({ scheduledAt: -1 });
    
    res.json({ success: true, data: { sessions } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/sessions', auth, async (req, res) => {
  try {
    const { title, description, skill, teacherId, scheduledAt, duration } = req.body;
    
    const sessionId = Date.now().toString();
    const session = await Session.create({
      title,
      description,
      skill,
      teacher: teacherId,
      student: req.userId,
      scheduledAt,
      duration: duration || 60,
      status: 'scheduled',
      meetingUrl: `https://meet.jit.si/skillshare-${sessionId}`
    });
    
    // Get both users
    const student = await User.findById(req.userId);
    const teacher = await User.findById(teacherId);
    
    // Notify teacher
    await Notification.create({
      userId: teacherId,
      type: 'session_scheduled',
      message: `${student.firstName} ${student.lastName} scheduled a session with you: ${title}`,
      relatedId: session._id.toString()
    });
    
    // Notify student
    await Notification.create({
      userId: req.userId,
      type: 'session_scheduled',
      message: `You scheduled a session with ${teacher.firstName} ${teacher.lastName}: ${title}`,
      relatedId: session._id.toString()
    });
    
    // Real-time notifications
    io.to(teacherId).emit('new-notification', {
      type: 'session_scheduled',
      message: `${student.firstName} ${student.lastName} scheduled a session with you: ${title}`,
      relatedId: session._id.toString()
    });
    
    res.json({ success: true, message: 'Session booked', data: { session } });
  } catch (err) {
    console.error('Session creation error:', err);
    res.status(500).json({ error: 'Failed to book session' });
  }
});

app.put('/api/sessions/:id/end', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    session.status = 'completed';
    await session.save();
    
    res.json({ success: true, message: 'Session ended' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// NOTIFICATIONS
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: { notifications } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} connected`);
  }
  
  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🗄️  MongoDB: Connected`);
  console.log(`📍 Timezone: Asia/Colombo`);
});

export default app;
