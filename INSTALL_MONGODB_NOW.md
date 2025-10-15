# 🗄️ INSTALL MONGODB - 5 MINUTE GUIDE

## Quick Install Steps

### 1. Download MongoDB
**Link:** https://www.mongodb.com/try/download/community

- Click "Download"
- Select: Windows, Latest Version (7.0+)
- File size: ~300 MB

### 2. Install
- Run the `.msi` file
- Click "Next" through the wizard
- ✅ **IMPORTANT:** Check "Install MongoDB as a Service"
- ✅ **IMPORTANT:** Check "Install MongoDB Compass" (optional but helpful)
- Click "Install"

### 3. Start MongoDB
Open PowerShell as Administrator:
```powershell
net start MongoDB
```

### 4. Verify
```powershell
mongosh
```

If you see `test>`, MongoDB is running! Type `exit` to quit.

### 5. Restart Your App
MongoDB will auto-connect and start storing data permanently!

---

**I'll fix the hardcoded data issue while you install MongoDB...**

