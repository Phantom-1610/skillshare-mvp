# 🚀 SkillShare - Complete Deployment Guide

## 📦 Package Contents

This is a complete, production-ready skill-exchange PWA with:
- ✅ Frontend: React + Vite + Tailwind CSS
- ✅ Backend: Node.js + Express + MongoDB
- ✅ Real-time: Socket.io for chat & notifications
- ✅ Video Calls: Jitsi Meet integration
- ✅ File Uploads: Profile pictures & verification docs
- ✅ Authentication: JWT + bcrypt
- ✅ Database: MongoDB (local)

---

## 🖥️ Running on Another Laptop

### Prerequisites
1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check: `node --version`

2. **MongoDB** (Community Edition)
   - Download: https://www.mongodb.com/try/download/community
   - Follow: `INSTALL_MONGODB_WINDOWS.md` in this folder

3. **Git** (for GitHub)
   - Download: https://git-scm.com/downloads

### Quick Start (3 Steps)

#### Step 1: Install Dependencies
```bash
# Navigate to the project folder
cd skillshare

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Step 2: Setup MongoDB
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or manually start mongod
mongod --dbpath "C:\data\db"
```

#### Step 3: Run the App
```bash
# From skillshare folder
.\run.bat

# Or manually:
# Terminal 1 (Backend):
cd backend
npm start

# Terminal 2 (Frontend):
cd frontend
npm run dev
```

**App will open at:** `http://localhost:3000`

---

## 📤 Upload to GitHub

### First Time Setup

#### 1. Create GitHub Repository
```bash
# Go to: https://github.com/new
# Repository name: skillshare-mvp
# Description: Peer-to-peer skill exchange platform
# Public or Private: Your choice
# Don't initialize with README (we have one)
```

#### 2. Initialize Git (if not already)
```bash
cd C:\Users\rilag\Downloads\SkillShare-MVP\skillshare

# Initialize git
git init

# Create .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo uploads/ >> .gitignore
echo dist/ >> .gitignore
echo .DS_Store >> .gitignore
```

#### 3. Add All Files
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete SkillShare MVP"
```

#### 4. Push to GitHub
```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/skillshare-mvp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Making Changes Later

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push
```

---

## 📥 Clone on Another Laptop

### Method 1: Using Git Clone
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/skillshare-mvp.git

# Navigate to folder
cd skillshare-mvp

# Install dependencies
cd backend
npm install
cd ../frontend
npm install

# Setup MongoDB (see Prerequisites)

# Run the app
cd ..
.\run.bat
```

### Method 2: Download ZIP
1. Go to your GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract to desired location
4. Follow "Quick Start" steps above

---

## 🔧 Environment Variables

### Backend (.env file)
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillshare
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Frontend (.env file)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
skillshare/
├── backend/
│   ├── src/
│   │   └── server.js          # Main backend server
│   ├── uploads/               # User uploaded files (gitignored)
│   ├── package.json
│   └── .env                   # Environment variables (gitignored)
├── frontend/
│   ├── src/
│   │   ├── pages/            # All page components
│   │   ├── components/       # Reusable components
│   │   ├── stores/           # Zustand state management
│   │   └── services/         # API & Socket services
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   └── sw.js            # Service worker
│   ├── package.json
│   └── .env                  # Environment variables (gitignored)
├── run.bat                   # Windows startup script
└── README.md                 # Main documentation
```

---

## 🌐 Deploy to Production

### Option 1: Heroku (Free Tier)

#### Backend
```bash
# Install Heroku CLI
# Download: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create skillshare-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

#### Frontend
```bash
# Build for production
cd frontend
npm run build

# Deploy to Netlify/Vercel
# Drag & drop 'dist' folder to: https://app.netlify.com/drop
```

### Option 2: VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js & MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Clone repository
git clone https://github.com/YOUR_USERNAME/skillshare-mvp.git
cd skillshare-mvp

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Use PM2 to keep backend running
npm install -g pm2
pm2 start backend/src/server.js --name skillshare-backend

# Setup Nginx for frontend
sudo apt install nginx
# Configure nginx to serve frontend/dist
```

---

## 🔒 Security Checklist (Production)

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable MongoDB authentication
- [ ] Set up CORS properly
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Sanitize user inputs
- [ ] Regular security updates

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
net start MongoDB

# Or check service status
sc query MongoDB
```

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### File Upload Not Working
```bash
# Check uploads directory exists
cd backend
mkdir uploads

# Check file permissions
icacls uploads /grant Users:F
```

---

## 📊 Features Included

### User Features
- ✅ Registration & Login (JWT authentication)
- ✅ Profile customization (bio, location, skills)
- ✅ Profile picture upload
- ✅ Skill verification documents
- ✅ Explore users by skills/location
- ✅ Match request system
- ✅ Real-time chat with Socket.io
- ✅ Video calls with Jitsi Meet
- ✅ Session scheduling
- ✅ Notifications system
- ✅ Reviews & ratings
- ✅ Account deletion

### Technical Features
- ✅ PWA (Progressive Web App)
- ✅ Offline support
- ✅ Responsive design
- ✅ Dark theme
- ✅ File uploads (images & PDFs)
- ✅ Real-time updates
- ✅ MongoDB integration
- ✅ RESTful API
- ✅ WebSocket communication

---

## 📝 Default Credentials (Development)

**Test Account:**
- Email: `john@example.com`
- Password: `password123`

**Or register a new account!**

---

## 🆘 Support

### Common Issues

1. **"MongoDB not found"**
   - Install MongoDB: See `INSTALL_MONGODB_WINDOWS.md`
   - Start service: `net start MongoDB`

2. **"Port 5000 in use"**
   - Change PORT in `backend/.env`
   - Or kill the process using the port

3. **"Cannot upload files"**
   - Check `backend/uploads` folder exists
   - Check file size (max 10MB)

4. **"Login not working"**
   - Clear browser cache
   - Check MongoDB is running
   - Check backend console for errors

### Get Help
- Check backend console for errors
- Check browser console (F12)
- Check MongoDB logs
- Review this guide carefully

---

## 🎯 Next Steps

### After Deployment
1. Test all features thoroughly
2. Set up proper domain name
3. Configure SSL certificate
4. Set up monitoring (e.g., Sentry)
5. Regular backups of MongoDB
6. Performance optimization
7. SEO optimization

### Future Enhancements
- Email notifications
- Mobile app (React Native)
- Advanced search filters
- Payment integration
- Skill badges & achievements
- Group sessions
- Calendar integration
- Analytics dashboard

---

## 📜 License

This project is open source. Feel free to use, modify, and distribute.

---

## 👨‍💻 Developer

Built with ❤️ for peer-to-peer skill exchange

**Tech Stack:**
- Frontend: React, Vite, Tailwind CSS, Zustand
- Backend: Node.js, Express, MongoDB, Socket.io
- Real-time: WebSockets
- Video: Jitsi Meet
- Storage: Local file system + MongoDB

---

## 🚀 Quick Commands Reference

```bash
# Install everything
cd backend && npm install && cd ../frontend && npm install

# Run development
.\run.bat

# Build for production
cd frontend && npm run build

# Push to GitHub
git add . && git commit -m "Update" && git push

# Clone on new machine
git clone <your-repo-url>
cd skillshare-mvp
cd backend && npm install
cd ../frontend && npm install
```

---

**You're all set! 🎉**

For any issues, check the troubleshooting section or review the console logs.
