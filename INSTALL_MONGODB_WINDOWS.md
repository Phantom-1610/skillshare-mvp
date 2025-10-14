# 📥 Install MongoDB on Windows - Quick Guide for SkillShare

## ❌ Current Status: MongoDB NOT Installed

Your SkillShare app is currently running in **in-memory mode**. Messages work but won't persist after server restart.

---

## ✅ Install MongoDB Community Edition

### **Step 1: Download MongoDB**

1. **Open browser** and go to:
   ```
   https://www.mongodb.com/try/download/community
   ```

2. **Select these options:**
   - Version: **7.0.x** (Current release)
   - Platform: **Windows x64**
   - Package: **MSI**

3. Click **Download** button

4. Wait for `mongodb-windows-x86_64-7.0.x-signed.msi` to download

---

### **Step 2: Install MongoDB**

1. **Run the downloaded .msi file** (double-click)

2. Click **Next** on the welcome screen

3. **Accept the license agreement** → Click **Next**

4. **Choose Setup Type:**
   - ✅ Select **Complete** (recommended)
   - Click **Next**

5. **Service Configuration (IMPORTANT!):**
   - ✅ **Check:** "Install MongoDB as a Service"
   - ✅ **Check:** "Run service as Network Service user"
   - Service Name: **MongoDB**
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log`
   - Click **Next**

6. **MongoDB Compass (Optional but Recommended):**
   - ✅ **Check:** "Install MongoDB Compass"
   - This is a GUI to view your database
   - Click **Next**

7. Click **Install**
   - Windows will ask for admin permission → Click **Yes**
   - Wait for installation (2-3 minutes)

8. Click **Finish**

---

### **Step 3: Verify Installation**

Open PowerShell or Command Prompt and run:

```powershell
# Check MongoDB version
mongod --version

# Check if service is running
Get-Service MongoDB
```

**Expected output:**
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB Server
```

---

### **Step 4: Start Your SkillShare App**

1. **Open PowerShell in your project folder:**
   ```powershell
   cd C:\Users\rilag\Downloads\SkillShare-MVP
   ```

2. **Run the app:**
   ```powershell
   cd skillshare
   .\run-app.bat
   ```

3. **Check backend logs** - You should see:
   ```
   ✅ MongoDB Connected - Sri Lankan SkillShare Database
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

5. **Test the chat:**
   - Login with: `john@example.com` / `password123`
   - Go to Explore → Message someone
   - ✅ Messages now persist in MongoDB!

---

## 🔧 Troubleshooting

### **Problem: MongoDB service won't start**

**Solution 1: Start service manually**
```powershell
net start MongoDB
```

**Solution 2: Start as administrator**
1. Right-click PowerShell → "Run as Administrator"
2. Run: `net start MongoDB`

### **Problem: "Access denied" when starting service**

**Solution:**
1. Press `Win + R`
2. Type: `services.msc` → Press Enter
3. Find **MongoDB Server**
4. Right-click → **Properties**
5. Startup type: **Automatic**
6. Click **Start**
7. Click **OK**

### **Problem: Port 27017 already in use**

**Solution:**
```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart MongoDB
net start MongoDB
```

---

## 📊 Verify SkillShare is Using MongoDB

### **Method 1: Check Backend Logs**

When you start `run-app.bat`, look for:
```
✅ MongoDB Connected - Sri Lankan SkillShare Database
✅ Message saved to MongoDB: John → Recipient match-3
```

### **Method 2: Use MongoDB Compass**

1. Open **MongoDB Compass** (installed with MongoDB)
2. Connection string: `mongodb://localhost:27017`
3. Click **Connect**
4. You should see database: **skillshare**
5. Collections:
   - `users` - User accounts
   - `messages` - Chat messages

### **Method 3: Check Messages Persist**

1. Send a message in SkillShare
2. Close browser
3. **Stop backend server** (Ctrl+C in terminal)
4. **Restart backend**
5. Open browser again
6. ✅ Your messages are still there!

---

## 🎯 Quick Install Summary

```
1. Download: https://www.mongodb.com/try/download/community
2. Run installer → Choose "Complete"
3. ✅ Install as a Service
4. ✅ Install MongoDB Compass
5. Verify: mongod --version
6. Run SkillShare: .\run-app.bat
7. ✅ MongoDB Connected!
```

---

## 📱 Alternative: MongoDB Compass Only (If Already Installed)

If MongoDB is installed but Compass is not:

1. Download: https://www.mongodb.com/try/download/compass
2. Install Compass
3. Connect to: `mongodb://localhost:27017`
4. View your SkillShare data!

---

## 🚀 After Installation

Once MongoDB is installed and running, your SkillShare app will:

✅ **Persist all messages permanently**
- No more data loss on restart
- Messages save to database immediately
- Conversations persist forever

✅ **Better performance**
- Indexed queries
- Faster message retrieval
- Scalable storage

✅ **Production-ready**
- Real database backing
- Data integrity
- Backup-capable

---

## 💡 Important Notes

1. **MongoDB runs as a Windows Service**
   - Starts automatically when Windows boots
   - Runs in background
   - Uses port 27017

2. **Data Location**
   - Default: `C:\Program Files\MongoDB\Server\7.0\data`
   - Don't delete this folder!

3. **Memory Usage**
   - MongoDB uses ~100-200 MB RAM
   - Normal and expected

4. **Firewall**
   - Windows may ask about firewall
   - ✅ Allow MongoDB on private networks
   - ❌ Block on public networks (security)

---

## 🆘 Need Help?

If installation fails or you have issues:

1. **Check Windows version:**
   - MongoDB requires Windows 10 or later
   - 64-bit system required

2. **Check disk space:**
   - Need at least 1 GB free space

3. **Run as Administrator:**
   - Right-click installer
   - "Run as Administrator"

4. **Restart computer:**
   - Sometimes Windows needs a restart
   - After restart, MongoDB should auto-start

---

## ✅ You're Done!

After following these steps:

1. ✅ MongoDB installed and running
2. ✅ SkillShare connects automatically
3. ✅ All messages persist in database
4. ✅ Production-ready chat system

**Start your app now:**
```powershell
cd C:\Users\rilag\Downloads\SkillShare-MVP\skillshare
.\run-app.bat
```

**Look for this in backend logs:**
```
✅ MongoDB Connected - Sri Lankan SkillShare Database
```

**You're ready to go!** 🚀

