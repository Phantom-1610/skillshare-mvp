# 🔐 SkillShare Sri Lanka - Login Credentials

## 🇱🇰 Production-Ready App

This is the **production version** with:
- ✅ Clean user registration (no fake data)
- ✅ Empty matches/chats for new users
- ✅ Sri Lankan localization (Asia/Colombo timezone)
- ✅ Real Jitsi Meet video calling
- ✅ Multi-user support across devices
- ✅ Skill verification system

---

## 👑 Administrator Account
```
Email: admin@skillshare.lk
Password: admin123
```

**Admin Features:**
- Platform dashboard with metrics
- User management
- Session oversight
- Content moderation

---

## 🆕 New User Registration

**To create a new account:**
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in your details
4. Start with empty profile - no fake data!

**Your account will have:**
- ✅ Empty matches list
- ✅ No pre-filled chats
- ✅ Clean profile
- ✅ Asia/Colombo timezone
- ✅ Access to all features

---

## 🎥 Video Calling - How It Works

### Jitsi Meet Integration

**YES, Jitsi Meet is fully enabled!**

#### How to Start a Video Call:

**Method 1: Quick Start**
1. Login to SkillShare
2. Go to **Sessions** page
3. Click **"Start Video Call Now"** button
4. Video conference starts instantly!

**Method 2: From Sessions**
1. Create a new session
2. Click "Join" when ready
3. Video call opens automatically

#### Connecting Users from Different Laptops:

**Example: Two users in different locations**

**User A (Laptop 1 - Colombo):**
1. Access: `http://192.168.1.100:3000` (your network IP)
2. Login/Register
3. Go to Sessions → Click "Start Video Call Now"
4. Note the session ID (e.g., `demo-1697123456789`)

**User B (Laptop 2 - Kandy):**
1. Access: `http://192.168.1.100:3000` (same network IP)
2. Login/Register
3. Navigate to: `/app/video/demo-1697123456789`
4. **Both users are now in the same video call!**

#### Features Available:
- ✅ HD Video & Audio
- ✅ Screen Sharing
- ✅ Built-in Chat
- ✅ Participant List
- ✅ Device Settings
- ✅ Mute/Unmute
- ✅ Camera On/Off
- ✅ End Call

---

## 💬 Real-Time Chat

**How to Chat with Other Users:**

1. **Register two accounts** (on different devices)
2. **User A:** Go to Chat page
3. **User B:** Also go to Chat page
4. **Both users:** Can see each other in conversations list
5. **Send messages** - they appear instantly!

**WebSocket Connection:**
- Real-time message delivery
- Online status indicators
- Message history
- Read receipts

---

## 🌐 Connecting Multiple Devices

### Same Network (Local):

**Step 1: Find Your IP Address**

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**Step 2: Update Frontend API**

Edit `skillshare/frontend/src/services/api.js`:
```javascript
baseURL: 'http://192.168.1.100:5000/api'
```

Edit `skillshare/frontend/src/services/socketService.js`:
```javascript
this.socket = io('http://192.168.1.100:5000', {
```

**Step 3: Access from Other Devices**
```
http://192.168.1.100:3000
```

### Remote Access (Using ngrok):

1. **Install ngrok:** https://ngrok.com/download

2. **Expose Backend:**
```bash
ngrok http 5000
```
You get: `https://abc123.ngrok.io`

3. **Update Frontend:**
```javascript
baseURL: 'https://abc123.ngrok.io/api'
```

4. **Expose Frontend:**
```bash
ngrok http 3000
```
You get: `https://xyz789.ngrok.io`

5. **Share URL** with anyone globally!

---

## 🆕 New Features

### 1. Skill Verification System

**Upload certificates/portfolios:**
1. Go to Profile
2. Click "Add Skill Verification"
3. Upload certificate/photo
4. Add description
5. Verification appears on profile

**Types:**
- Certificate (PDF, Image)
- Portfolio (Link, Image)
- Photo Evidence

### 2. Settings Page

**Access:** Profile Menu → Settings

**Configure:**
- Theme (Light/Dark/System)
- Notifications (Email, Push, Match, Message)
- Privacy (Profile visibility, Show email/location)
- Localization (Language: English/Sinhala/Tamil, Timezone)

### 3. Logout Button

**Location:** Top-right user menu
- Click your profile picture
- Select "Sign out"

### 4. Sri Lankan Localization

**Timezone:** Asia/Colombo (GMT+5:30)
**Locations:** Colombo, Kandy, Galle, Jaffna, etc.
**Languages:** English, Sinhala (සිංහල), Tamil (தமிழ்)

---

## 🚀 Quick Start Guide

### For Local Testing:

**Terminal 1 - Backend:**
```bash
cd skillshare/backend
node src/production-server.js
```

**Terminal 2 - Frontend:**
```bash
cd skillshare/frontend
npm run dev
```

**Or use the startup script:**
```bash
cd skillshare
.\run-app.bat  # Windows
./run-app.sh   # Mac/Linux
```

### Test Multi-User Features:

1. **Open on Laptop 1:**
   - Register as "Kasun Perera"
   - Add skills: JavaScript, React
   - Set location: Colombo

2. **Open on Laptop 2 (same network):**
   - Access via IP: `http://192.168.1.100:3000`
   - Register as "Nimal Silva"
   - Add skills: Python, Django
   - Set location: Kandy

3. **Test Features:**
   - ✅ Search for each other
   - ✅ Send match requests
   - ✅ Chat in real-time
   - ✅ Book a session
   - ✅ Start video call together!

---

## 📱 All Features Working

### ✅ Authentication
- Registration (clean, no fake data)
- Login
- Logout
- JWT sessions

### ✅ Profile Management
- Edit profile
- Add/remove skills
- Upload skill verifications
- Set availability
- View own profile by default

### ✅ Skill Matching
- Search users by skills
- Match algorithm with scoring
- Accept/decline matches
- View match reasons

### ✅ Sessions
- Create sessions
- Schedule for future
- Join video calls
- Track history

### ✅ Real-Time Chat
- WebSocket messaging
- Multiple conversations
- Message history
- Online status

### ✅ Video Conferencing
- Jitsi Meet integration
- HD video/audio
- Screen sharing
- Multi-participant
- Works across devices!

### ✅ Resources
- Learning roadmaps
- Categorized by skill
- External links
- Community resources

### ✅ Settings
- Theme toggle (working!)
- Notifications
- Privacy controls
- Localization

### ✅ Admin Dashboard
- Platform metrics
- User management
- Activity monitoring

---

## 🔧 Button Functions

All buttons now perform their intended functions:

- **Start Video Call Now** → Opens Jitsi Meet conference
- **New Session** → Creates session booking
- **Send Message** → Sends real-time chat message
- **Accept Match** → Confirms skill match
- **Edit Profile** → Opens profile editor
- **Settings** → Opens settings page
- **Logout** → Signs out and redirects to login
- **Theme Toggle** → Switches light/dark mode

---

## 📞 Support & Troubleshooting

### Can't connect from other laptop?
1. Check firewall settings
2. Ensure same network
3. Verify IP address
4. Try `ping 192.168.1.100`

### Video call not working?
1. Allow camera/microphone permissions
2. Use Chrome/Firefox (recommended)
3. Check https://status.jitsi.io/
4. Ensure both users joined same room ID

### Chat messages delayed?
1. Check WebSocket connection (F12 → Network)
2. Restart backend server
3. Clear browser cache
4. Check network latency

---

## 🎉 Ready to Use!

**Your production-ready SkillShare PWA is now complete with:**
- ✅ Clean user registration
- ✅ Real video calling (Jitsi Meet)
- ✅ Multi-device support
- ✅ Sri Lankan localization
- ✅ All buttons working
- ✅ Settings page
- ✅ Skill verification
- ✅ Logout functionality

**Start the app and begin connecting users!**

```bash
cd skillshare
.\run-app.bat
```

**Access:** http://localhost:3000
**Admin:** admin@skillshare.lk / admin123

**Test with multiple devices on your network!**