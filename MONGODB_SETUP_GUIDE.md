# 🗄️ MongoDB Setup Guide for SkillShare

## Why You Need MongoDB

Currently, the app uses **in-memory storage** which means:
- ❌ Data is lost when server restarts
- ❌ Can't upload files (certificates, photos)
- ❌ Can't scale to multiple servers
- ❌ No data backup

With MongoDB:
- ✅ Data persists permanently
- ✅ File uploads via GridFS
- ✅ Scalable and production-ready
- ✅ Easy backup and restore

---

## 📦 Step 1: Install MongoDB

### Windows:

1. **Download MongoDB Community Server:**
   - Go to: `https://www.mongodb.com/try/download/community`
   - Select: Windows, latest version (7.0+)
   - Download the MSI installer

2. **Run the Installer:**
   - Double-click the `.msi` file
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)

3. **Verify Installation:**
   ```powershell
   # Open PowerShell
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

### Mac:

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh --version
```

### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create sources list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

---

## 🔧 Step 2: Install MongoDB Dependencies

```bash
cd skillshare/backend
npm install mongodb mongoose multer multer-gridfs-storage gridfs-stream
```

---

## 📝 Step 3: Create MongoDB Models

Create `backend/src/models/` directory and add these files:

### `backend/src/models/User.js`:
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  bio: String,
  location: String,
  profilePicture: String,
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
    schedule: [{
      day: String,
      timeSlots: [{ start: String, end: String }]
    }]
  },
  stats: {
    sessionsTaught: { type: Number, default: 0 },
    sessionsAttended: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  skillVerifications: [{
    skill: String,
    verificationType: String,
    fileUrl: String,
    fileId: mongoose.Schema.Types.ObjectId,
    description: String,
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
```

### `backend/src/models/Message.js`:
```javascript
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  threadId: { type: String, required: true, index: true },
  fileUrl: String,
  fileId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);
```

### `backend/src/models/Session.js`:
```javascript
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  skill: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingUrl: String,
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);
```

### `backend/src/models/Notification.js`:
```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['match_request', 'session_booked', 'message', 'review', 'system'],
    required: true
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
```

### `backend/src/models/Review.js`:
```javascript
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, {
  timestamps: true
});

export default mongoose.model('Review', reviewSchema);
```

### `backend/src/models/Report.js`:
```javascript
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Report', reportSchema);
```

---

## 🔌 Step 4: Update Backend Configuration

### Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/skillshare
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

### Create `backend/src/config/database.js`:
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 🚀 Step 5: Update Server to Use MongoDB

### Update `backend/src/working-server.js`:

At the top, add:
```javascript
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import Message from './models/Message.js';
import Session from './models/Session.js';
import Notification from './models/Notification.js';
import Review from './models/Review.js';
import Report from './models/Report.js';

dotenv.config();

// Connect to MongoDB
connectDB();
```

Replace in-memory arrays with MongoDB queries. For example:

**OLD (in-memory):**
```javascript
app.post('/api/auth/register', async (req, res) => {
  const newUser = { id: Date.now().toString(), ...req.body };
  users.push(newUser);
  res.json({ user: newUser });
});
```

**NEW (MongoDB):**
```javascript
app.post('/api/auth/register', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json({ user: newUser });
});
```

---

## 📁 Step 6: Setup File Upload with GridFS

### Create `backend/src/middleware/upload.js`:
```javascript
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads'
    };
  }
});

export const upload = multer({ storage });
```

### Add file upload route:
```javascript
import { upload } from './middleware/upload.js';

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  res.json({
    success: true,
    data: {
      fileId: req.file.id,
      filename: req.file.filename,
      url: `/api/files/${req.file.id}`
    }
  });
});
```

---

## ✅ Step 7: Test MongoDB Connection

1. **Start MongoDB:**
   ```powershell
   net start MongoDB
   ```

2. **Open MongoDB Compass:**
   - Connection string: `mongodb://localhost:27017`
   - Database: `skillshare`

3. **Start Backend:**
   ```bash
   cd skillshare/backend
   npm run dev
   ```

4. **Check Console:**
   ```
   ✅ MongoDB Connected: localhost
   🚀 SkillShare Backend running on port 5000
   ```

---

## 🔄 Step 8: Migrate Existing Data (Optional)

If you want to keep your test users:

```javascript
// backend/src/scripts/seedData.js
import connectDB from './config/database.js';
import User from './models/User.js';

const seedUsers = async () => {
  await connectDB();
  
  await User.create([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      // ... other fields
    }
  ]);
  
  console.log('✅ Data seeded');
  process.exit();
};

seedUsers();
```

Run: `node backend/src/scripts/seedData.js`

---

## 🎯 Step 9: Update Frontend (No Changes Needed!)

The frontend already uses the API correctly. It doesn't care if data comes from memory or MongoDB!

---

## 🏁 Step 10: Verify Everything Works

### Test Checklist:
- [ ] MongoDB is running
- [ ] Backend connects to MongoDB
- [ ] Can register new user (data saved to DB)
- [ ] Can login (reads from DB)
- [ ] Can upload files (GridFS)
- [ ] Can send messages (saved to DB)
- [ ] Data persists after server restart

---

## 🐛 Troubleshooting

### Error: "MongoServerError: connect ECONNREFUSED"
**Solution:** MongoDB service not running
```powershell
net start MongoDB
```

### Error: "Cannot find module 'mongoose'"
**Solution:** Install dependencies
```bash
npm install mongoose
```

### Error: "GridFsStorage is not a constructor"
**Solution:** Check import syntax
```javascript
import { GridFsStorage } from 'multer-gridfs-storage';
```

---

## 📚 Resources

- MongoDB Docs: https://www.mongodb.com/docs/
- Mongoose Docs: https://mongoosejs.com/docs/
- GridFS Guide: https://www.mongodb.com/docs/manual/core/gridfs/

---

## 🎓 What You'll Gain

After MongoDB setup:
- ✅ Production-ready data storage
- ✅ File upload functionality
- ✅ Data persistence
- ✅ Scalability
- ✅ Backup/restore capability
- ✅ Query performance optimization
- ✅ Full-text search
- ✅ Aggregation pipelines

---

## ⏱️ Estimated Time

- Installation: 10-15 minutes
- Model creation: 30 minutes
- Backend migration: 1-2 hours
- Testing: 30 minutes

**Total: 2-3 hours**

---

## 🚀 Ready to Go!

Once MongoDB is setup, your SkillShare app will be **truly production-ready** and ready to deploy! 🎉
