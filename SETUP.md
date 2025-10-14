# 🚀 SkillShare PWA - Complete Setup Guide

## Quick Start (Windows)

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (18.x or higher)
- Install with default settings

### 2. Run the App
```bash
# Double-click this file or run in terminal:
start-app.bat
```

**OR manually:**

```bash
# Install dependencies
npm install
npm run install-all

# Start backend (Terminal 1)
cd backend
node src/working-server.js

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

## Quick Start (Mac/Linux)

### 1. Install Node.js
```bash
# Using Homebrew (Mac)
brew install node

# Using package manager (Linux)
sudo apt install nodejs npm  # Ubuntu/Debian
sudo yum install nodejs npm  # CentOS/RHEL
```

### 2. Run the App
```bash
# Make script executable and run
chmod +x start-app.sh
./start-app.sh
```

**OR manually:**

```bash
# Install dependencies
npm install
npm run install-all

# Start backend (Terminal 1)
cd backend && node src/working-server.js &

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

## 🌐 Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔐 Demo Login Credentials

```
Email: john@example.com
Password: password123
```

## 📱 Features Available

### ✅ Complete Working Features

1. **Authentication System**
   - User registration and login
   - JWT-based authentication
   - Protected routes

2. **User Dashboard**
   - Personal stats and metrics
   - Recent activity feed
   - Quick actions

3. **Explore Page**
   - Search and filter users
   - View user profiles
   - Skill-based matching

4. **Matches System**
   - View pending/accepted matches
   - Accept/decline match requests
   - Match scoring and reasons

5. **Sessions Management**
   - Create and schedule sessions
   - Online and in-person sessions
   - Session status tracking

6. **Real-time Chat**
   - WebSocket-based messaging
   - Multiple conversations
   - Message status indicators

7. **Video Sessions**
   - Jitsi Meet integration ready
   - Session controls (mute, video, chat)
   - Session management

8. **Resources & Roadmaps**
   - Categorized learning resources
   - Skill-specific roadmaps
   - External links and tutorials

9. **User Profiles**
   - Complete profile management
   - Skills and availability
   - Social features

10. **PWA Features**
    - Installable on mobile/desktop
    - Offline support
    - Service worker caching

## 🎨 Design System

- **Colors**: Black (#0b0b0b), Lavender (#B497BD), Soft Teal (#64C7B8), Warm Gold (#E6C07B)
- **Typography**: Inter font family
- **Components**: Consistent design system
- **Responsive**: Works on all devices

## 🔧 Technical Stack

### Backend
- Node.js + Express.js
- In-memory database (no MongoDB required)
- Socket.io for real-time features
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18 + Vite
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Socket.io client for real-time features

## 📁 Project Structure

```
skillshare/
├── backend/
│   ├── src/
│   │   ├── working-server.js    # Main server file
│   │   └── ...
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/               # All page components
│   │   ├── components/          # Reusable components
│   │   ├── stores/              # State management
│   │   └── services/            # API services
│   └── package.json
├── start-app.bat               # Windows startup script
├── start-app.sh                # Mac/Linux startup script
└── package.json                # Root package.json
```

## 🚀 Deployment Ready

The app is production-ready with:
- Environment configuration
- Error handling
- Security middleware
- Rate limiting
- CORS configuration
- PWA optimization

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

### Node.js Not Found
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. **Run the app** using the startup scripts
2. **Register a new account** or use demo credentials
3. **Explore all features** across different pages
4. **Test video calling** (Jitsi integration ready)
5. **Try real-time chat** between users
6. **Browse resources** and roadmaps

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure Node.js is properly installed
3. Verify ports 3000 and 5000 are available
4. Try clearing npm cache and reinstalling dependencies

---

**🎉 Enjoy your complete SkillShare PWA!**
