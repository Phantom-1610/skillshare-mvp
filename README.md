# 🎓 SkillShare - Peer-to-Peer Skill Exchange Platform

> A social, real-time platform for students and professionals to exchange skills through video sessions, chat, and community matching.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D5.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features

### 🎯 Core Features
- **User Profiles** - Customizable profiles with bio, skills, and verification
- **Skill Matching** - Find users based on skills offered and wanted
- **Match Requests** - Send/accept/reject match requests
- **Real-time Chat** - Socket.io powered instant messaging
- **Video Calls** - Integrated Jitsi Meet for video sessions
- **Session Scheduling** - Book and manage skill exchange sessions
- **Notifications** - Real-time notifications for matches, messages, sessions
- **Reviews & Ratings** - Rate and review other users
- **File Uploads** - Profile pictures and skill verification documents

### 🔐 Security
- JWT authentication
- bcrypt password hashing
- Secure file uploads (10MB limit)
- Account deletion with complete data removal

### 🎨 UI/UX
- Modern, responsive design
- Dark theme
- PWA (Progressive Web App)
- Offline support
- Sri Lankan localization (time, locations)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5.0+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/skillshare-mvp.git
cd skillshare-mvp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start MongoDB
net start MongoDB

# Run the application
cd ..
.\run.bat
```

**App opens at:** `http://localhost:3000`

---

## 📁 Project Structure

```
skillshare/
├── backend/
│   ├── src/
│   │   └── server.js              # Express server + Socket.io
│   ├── uploads/                   # User uploaded files
│   ├── package.json
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   └── sw.js                  # Service worker
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── MatchesPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SessionsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── components/            # Reusable components
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── stores/                # Zustand state management
│   │   │   ├── auth.js
│   │   │   └── themeStore.js
│   │   ├── services/              # API services
│   │   │   ├── api.js
│   │   │   └── socketService.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
├── run.bat                        # Windows startup script
├── .gitignore
├── README.md                      # This file
└── DEPLOYMENT_GUIDE.md            # Detailed deployment guide
```

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

### External Services
- **Jitsi Meet** - Video conferencing

---

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillshare
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Frontend Environment Variables
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload` - Upload file
- `DELETE /api/users/account` - Delete account

### Match Requests
- `POST /api/match-requests` - Send match request
- `GET /api/match-requests/sent` - Get sent requests
- `GET /api/match-requests/received` - Get received requests
- `PUT /api/match-requests/:id/accept` - Accept request
- `PUT /api/match-requests/:id/reject` - Reject request
- `GET /api/users/matches` - Get accepted matches

### Messages
- `GET /api/messages` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id/end` - End session

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Reviews
- `POST /api/users/:userId/reviews` - Submit review
- `GET /api/users/:userId/stats` - Get user stats

---

## 🎮 Usage

### For Users

1. **Register/Login**
   - Create account or login
   - Complete your profile

2. **Explore Users**
   - Browse users by skills
   - Filter by location
   - View profiles

3. **Connect**
   - Send match requests
   - Accept/reject requests
   - Start chatting

4. **Schedule Sessions**
   - Book sessions with matches
   - Join video calls
   - Rate and review

5. **Manage Profile**
   - Upload profile picture
   - Add verification documents
   - Update skills

### For Developers

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📱 PWA Features

- **Installable** - Add to home screen
- **Offline Support** - Service worker caching
- **Push Notifications** - (Coming soon)
- **Responsive** - Works on all devices

---

## 🌍 Localization

- **Timezone**: Asia/Colombo (Sri Lanka)
- **Locations**: Online, Colombo, Kandy
- **Languages**: English (Sinhala & Tamil coming soon)

---

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- File upload validation (type & size)
- SQL injection prevention (Mongoose)
- XSS protection
- CORS configuration
- Rate limiting (recommended for production)

---

## 📊 Database Schema

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  location: String,
  avatar: String,
  offeredSkills: [{ skill, level, description }],
  desiredSkills: [{ skill }],
  verificationDocs: [String],
  rating: Number,
  sessionsAttended: Number,
  sessionsTaught: Number
}
```

### Message
```javascript
{
  sender: String,
  recipient: String,
  content: String,
  type: String,
  createdAt: Date
}
```

### Session
```javascript
{
  title: String,
  teacher: String,
  student: String,
  scheduledAt: Date,
  duration: Number,
  status: String,
  meetingUrl: String
}
```

### MatchRequest
```javascript
{
  senderId: String,
  receiverId: String,
  status: String (pending/accepted/rejected),
  createdAt: Date
}
```

---

## 🐛 Troubleshooting

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting.

**Common Issues:**
- MongoDB not running → `net start MongoDB`
- Port in use → Change PORT in .env
- Dependencies missing → `npm install`
- File upload fails → Check uploads/ folder exists

---

## 🚀 Deployment

### Heroku
```bash
heroku create skillshare-app
heroku addons:create mongolab:sandbox
git push heroku main
```

### Netlify (Frontend)
```bash
cd frontend
npm run build
# Drag & drop 'dist' folder to Netlify
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

---

## 📝 Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Development mode with nodemon
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ for peer-to-peer learning

---

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the database
- Jitsi for video conferencing
- Socket.io for real-time features
- Tailwind CSS for styling

---

## 📞 Support

For issues and questions:
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review console logs
3. Check MongoDB connection
4. Verify all dependencies installed

---

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced search
- [ ] Payment integration
- [ ] Group sessions
- [ ] Calendar sync
- [ ] Analytics dashboard
- [ ] Sinhala & Tamil translations

---

**Happy Skill Sharing! 🎓✨**
