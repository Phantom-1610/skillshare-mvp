# SkillShare 🎓

**A modern peer-to-peer skill exchange platform that connects people to learn and teach through video calls, messaging, and skill matching.**

![SkillShare](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🌟 What is SkillShare?

SkillShare is a social learning platform where people can:
- **Teach** skills they're good at
- **Learn** new skills from others
- **Connect** through video calls and messaging
- **Match** with people based on skill compatibility
- **Schedule** learning sessions
- **Verify** skills with documents and reviews

Think of it as "Uber for skills" - but instead of rides, you're exchanging knowledge! 🚀

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Phantom-1610/skillshare-mvp.git
   cd skillshare-mvp
   ```

2. **Run the setup script:**
   
   **Windows:**
   ```bash
   setup.bat
   ```
   
   **Mac/Linux:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the application:**
   
   **Windows:**
   ```bash
   run.bat
   ```
   
   **Mac/Linux:**
   ```bash
   ./run.sh
   ```

4. **Open your browser:**
   - **App:** http://localhost:3000
   - **API:** http://localhost:5000

That's it! The app will automatically install dependencies, configure the database, and start both servers.

## 🎯 Features

### Core Features
- **🔐 User Authentication** - Secure registration and login
- **👤 Profile Management** - Customizable profiles with skill verification
- **🔍 Skill Matching** - Find people to learn from or teach
- **💬 Real-time Chat** - Instant messaging with Socket.io
- **📹 Video Calls** - Integrated Jitsi Meet for sessions
- **📅 Session Scheduling** - Book and manage learning sessions
- **🔔 Notifications** - Real-time updates for matches and messages
- **📱 PWA Support** - Install as a mobile app

### Advanced Features
- **🌍 Multi-platform** - Works on any device with a browser
- **☁️ Cloud Database** - All data synced across devices
- **🔒 Secure** - JWT authentication and password hashing
- **📊 Analytics** - Track your learning progress
- **⭐ Reviews** - Rate and review your learning experiences

## 🗄️ Database

SkillShare uses **MongoDB Atlas** (cloud database), which means:
- ✅ All your data is automatically backed up
- ✅ Access your account from any device
- ✅ Real-time sync across all platforms
- ✅ No local database setup required

## 🔐 Demo Accounts

Try SkillShare with these pre-loaded accounts:

| Email | Password | Role |
|-------|----------|------|
| `hihi@gmail.com` | `test123` | User |
| `hehe@gmail.com` | `test123` | User |
| `MA@gmail.com` | `test123` | User |

Or create your own account! 🎉

## 📱 How to Use

### Getting Started
1. **Register/Login** - Create an account or use demo credentials
2. **Complete Your Profile** - Add skills, bio, and verification documents
3. **Explore** - Browse other users and their skills
4. **Match** - Send match requests to people you want to learn from
5. **Chat** - Message your matches
6. **Schedule Sessions** - Book video call sessions
7. **Teach/Learn** - Conduct sessions via integrated video calls

### Tips for Success
- **Be specific** about your skills and what you want to learn
- **Upload verification** documents to build trust
- **Write a good bio** - it helps others understand you
- **Be responsive** - reply to messages and match requests quickly
- **Schedule regular sessions** - consistency is key to learning

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Socket.io** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **Socket.io** - Real-time features

### Video & Communication
- **Jitsi Meet** - Video conferencing
- **WebRTC** - Peer-to-peer communication

## 📁 Project Structure

```
skillshare/
├── backend/                 # Node.js API server
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── uploads/            # File uploads
│   └── package.json        # Dependencies
├── frontend/               # React application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── stores/         # State management
│   └── package.json        # Dependencies
├── setup.bat              # Windows setup script
├── setup.sh               # Mac/Linux setup script
├── run.bat                # Windows run script
├── run.sh                 # Mac/Linux run script
└── README.md              # This file
```

## 🔧 Troubleshooting

### Common Issues

**Setup fails:**
- Make sure Node.js is installed (version 16+)
- Check your internet connection
- Try running `npm install` manually in both `backend/` and `frontend/` folders

**App won't start:**
- Check if ports 3000 and 5000 are available
- Make sure no other apps are using these ports
- Check the console for error messages

**Can't connect to database:**
- The app uses MongoDB Atlas (cloud database)
- No local database setup required
- Check your internet connection

**Video calls not working:**
- Make sure you have a working camera and microphone
- Check browser permissions for camera/mic access
- Try refreshing the page

### Getting Help

If you're still having issues:
1. Check the console for error messages
2. Make sure all dependencies are installed
3. Try restarting the app
4. Check our GitHub issues page

## 👥 Team Collaboration

This project was developed by a team of 5 developers, each contributing specific features:

### **Team Contributions:**
- **Rila** - Base System & Matching (Core authentication, user discovery, and matching algorithm)
- **Khan** - Chat System (Real-time messaging with Socket.io integration)
- **Yoosuf** - Video System (Video calls, session scheduling, and Jitsi Meet integration)
- **Aashif** - Profile Management (User profiles, file uploads, and skill verification)
- **Haizam** - Notifications & Polish (Real-time notifications, error handling, and UI improvements)

### **For Lecturers/Assessors:**
This repository demonstrates collaborative development with clear separation of individual contributions. Each team member's work is documented in the `team-contributions/` folder, showing their specific features and implementations.

### **Development Setup**

1. Clone the repository
2. Run `setup.bat` (Windows) or `./setup.sh` (Mac/Linux)
3. The app will automatically install dependencies and start
4. Open http://localhost:3000 to view the application

**Note:** All team members worked on the same repository, with each person contributing their assigned features through separate commits and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Jitsi Meet** for video conferencing
- **MongoDB Atlas** for cloud database
- **React** and **Node.js** communities
- **Tailwind CSS** for beautiful styling

---

## 🎉 Ready to Start Learning?

**SkillShare is ready to use!** Run the setup script and start your learning journey today.

**Remember:** The best way to learn is to teach others. Share your knowledge and learn from the community! 🌟

---

*Made with ❤️ for the global learning community*