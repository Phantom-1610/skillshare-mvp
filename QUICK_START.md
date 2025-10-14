# ⚡ Quick Start Guide

## 🎯 Get Running in 5 Minutes!

### Step 1: Install Node.js
Download and install from: https://nodejs.org/
(Choose LTS version)

### Step 2: Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Or follow: `INSTALL_MONGODB_WINDOWS.md`

### Step 3: Install Dependencies
```bash
cd skillshare

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 4: Start MongoDB
```bash
net start MongoDB
```

### Step 5: Run the App
```bash
# From skillshare folder
.\run.bat
```

**Done! App opens at http://localhost:3000** 🎉

---

## 📤 Upload to GitHub (First Time)

### 1. Create Repository on GitHub
- Go to: https://github.com/new
- Name: `skillshare-mvp`
- Click "Create repository"

### 2. Push Your Code
```bash
cd skillshare

# Initialize (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: SkillShare MVP"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/skillshare-mvp.git

# Push
git branch -M main
git push -u origin main
```

**Done! Your code is on GitHub** 🚀

---

## 💻 Clone on Another Laptop

### Method 1: Git Clone
```bash
# Clone
git clone https://github.com/YOUR_USERNAME/skillshare-mvp.git

# Install
cd skillshare-mvp
cd backend && npm install
cd ../frontend && npm install

# Run
cd ..
.\run.bat
```

### Method 2: Download ZIP
1. Go to your GitHub repo
2. Click "Code" → "Download ZIP"
3. Extract
4. Follow Step 3-5 from "Get Running" above

---

## 🔄 Update Code Later

```bash
# After making changes
git add .
git commit -m "Your changes description"
git push
```

---

## ❓ Problems?

### MongoDB not starting
```bash
# Check if installed
mongod --version

# Start manually
mongod --dbpath "C:\data\db"
```

### Port already in use
```bash
# Kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Can't push to GitHub
```bash
# Check remote
git remote -v

# Re-add remote
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/skillshare-mvp.git
git push -u origin main
```

---

## 📚 More Help

- Full guide: `DEPLOYMENT_GUIDE.md`
- MongoDB setup: `INSTALL_MONGODB_WINDOWS.md`
- Features: `README.md`

---

**That's it! You're ready to go! 🎊**

