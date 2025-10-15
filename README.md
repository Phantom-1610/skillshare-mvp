# SkillShare - Peer-to-Peer Skill Exchange Platform

A modern web application that connects people to learn and teach skills through video calls, messaging, and skill matching.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Git

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/phan16tom-collab/skillshare-mvp.git
   cd skillshare-mvp
   ```

2. **Run setup script:**
   
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
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## ✨ Features

- **User Registration & Authentication** - Secure JWT-based auth
- **Skill Matching** - Find people to learn from or teach
- **Real-time Chat** - Instant messaging with Socket.io
- **Video Calls** - Integrated Jitsi Meet for sessions
- **Profile Management** - Customizable profiles with skill verification
- **Session Scheduling** - Book and manage learning sessions
- **Notifications** - Real-time updates for matches and messages
- **PWA Support** - Install as a mobile app

## 🗄️ Database

The app uses **MongoDB Atlas** (cloud database) so all data is shared across devices and users.

**Pre-loaded Data:**
- 19 demo users (Sri Lankan profiles)
- Sample messages and sessions
- Your existing accounts are preserved

## 🔐 Login Credentials

**Demo Accounts:**
- Email: `hihi@gmail.com` | Password: `test123`
- Email: `hehe@gmail.com` | Password: `test123`
- Email: `MA@gmail.com` | Password: `test123`

**Or create a new account!**

## 📱 Usage

1. **Register/Login** - Create account or use demo credentials
2. **Complete Profile** - Add skills, bio, and verification documents
3. **Explore** - Browse other users and their skills
4. **Match** - Send match requests to people you want to learn from
5. **Chat** - Message your matches
6. **Schedule Sessions** - Book video call sessions
7. **Teach/Learn** - Conduct sessions via integrated video calls

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Zustand
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB Atlas
- **Video:** Jitsi Meet
- **Authentication:** JWT, bcrypt

## 📁 Project Structure

```
skillshare/
├── backend/          # Node.js API server
├── frontend/         # React application
├── setup.bat         # Windows setup script
├── setup.sh          # Mac/Linux setup script
├── run.bat           # Windows run script
├── run.sh            # Mac/Linux run script
└── README.md         # This file
```

## 🔧 Troubleshooting

**If setup fails:**
1. Make sure Node.js is installed
2. Check internet connection
3. Try running `npm install` manually in both `backend/` and `frontend/` folders

**If app won't start:**
1. Check if ports 3000 and 5000 are available
2. Make sure MongoDB Atlas is accessible
3. Check the console for error messages

## 📞 Support

For issues or questions, check the GitHub repository or create an issue.

---

**Ready to start learning and teaching? Run the setup script and dive in! 🎓**