# SkillShare 🎓

**A modern peer-to-peer skill exchange platform that connects people to learn and teach through video calls, messaging, and skill matching.**

![SkillShare](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

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

- **🔐 User Authentication** - Secure registration and login
- **👤 Profile Management** - Customizable profiles with skill verification
- **🔍 Skill Matching** - Find people to learn from or teach
- **💬 Real-time Chat** - Instant messaging with Socket.io
- **📹 Video Calls** - Integrated Jitsi Meet for sessions
- **📅 Session Scheduling** - Book and manage learning sessions
- **🔔 Notifications** - Real-time updates for matches and messages
- **☁️ Cloud Database** - All data synced across devices with MongoDB Atlas

## 🔐 Demo Accounts

Try SkillShare with these pre-loaded accounts:

| Email | Password | Role |
|-------|----------|------|
| `hihi@gmail.com` | `test123` | User |
| `hehe@gmail.com` | `test123` | User |
| `MA@gmail.com` | `test123` | User |

Or create your own account! 🎉

## 📱 How to Use

1. **Register/Login** - Create an account or use demo credentials
2. **Complete Your Profile** - Add skills, bio, and verification documents
3. **Explore** - Browse other users and their skills
4. **Match** - Send match requests to people you want to learn from
5. **Chat** - Message your matches
6. **Schedule Sessions** - Book video call sessions
7. **Teach/Learn** - Conduct sessions via integrated video calls

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, Socket.io
- **Backend:** Node.js, Express, MongoDB Atlas, JWT
- **Video:** Jitsi Meet, WebRTC

## 👥 Team Contributions

This project was developed by a team of 5 developers:

- **Rila** - Base System & Matching
- **Khan** - Chat System  
- **Yoosuf** - Video System
- **Aashif** - Profile Management
- **Haizam** - Notifications & Polish

## 📁 Project Structure

```
skillshare/
├── backend/                 # Node.js API server
├── frontend/               # React application
├── team-contributions/     # Individual team member contributions
├── docs/                   # Detailed documentation
├── setup.bat/.sh          # Setup scripts
├── run.bat/.sh            # Run scripts
└── README.md              # This file
```

## 🔧 Troubleshooting

**Setup fails:** Make sure Node.js is installed (version 16+)

**App won't start:** Check if ports 3000 and 5000 are available

**Can't connect to database:** The app uses MongoDB Atlas (cloud database) - no local setup required

**Video calls not working:** Check browser permissions for camera/mic access

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Ready to Start Learning?

**SkillShare is ready to use!** Run the setup script and start your learning journey today.

**Remember:** The best way to learn is to teach others. Share your knowledge and learn from the community! 🌟

---

*Made with ❤️ for the global learning community*

## 📚 Detailed Documentation

For more detailed information, see the [Complete Documentation](docs/README.md).
