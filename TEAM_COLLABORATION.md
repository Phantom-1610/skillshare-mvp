# Team Collaboration Guide 👥

**How to work together on SkillShare as a team of 5 developers**

## 🎯 **Team Structure**

### **Base Contributor (You)**
- **Responsibility:** Core matching system and base app structure
- **File:** `team-contributions/01-base-matching-system.js`
- **Features:** Authentication, user discovery, matching algorithm, basic UI

### **Team Member 2**
- **Responsibility:** Chat system and real-time messaging
- **File:** `team-contributions/02-chat-system.js`
- **Features:** Socket.io integration, message persistence, chat UI

### **Team Member 3**
- **Responsibility:** Video system and session management
- **File:** `team-contributions/03-video-system.js`
- **Features:** Jitsi Meet integration, session scheduling, video calls

### **Team Member 4**
- **Responsibility:** Profile management and customization
- **File:** `team-contributions/04-profile-management.js`
- **Features:** Profile editing, file uploads, skill verification, reviews

### **Team Member 5**
- **Responsibility:** Notifications and final polish
- **File:** `team-contributions/05-notifications-polish.js`
- **Features:** Real-time notifications, error handling, UI improvements

## 🚀 **Getting Started**

### **For the Base Contributor (You):**
1. **Commit your base code:**
   ```bash
   git add team-contributions/01-base-matching-system.js
   git commit -m "feat: Add base matching system and authentication

   - Implemented user registration and login
   - Added user discovery and matching algorithm
   - Created basic UI framework
   - Set up MongoDB integration
   
   Contributor: [Your Name]"
   ```

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

### **For Team Members 2-5:**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/phan16tom-collab/skillshare-mvp.git
   cd skillshare-mvp
   ```

2. **Create your feature branch:**
   ```bash
   git checkout -b feature/[your-name]-[feature-name]
   # Example: git checkout -b feature/john-chat-system
   ```

3. **Add your contribution:**
   - Copy your assigned file to the main codebase
   - Integrate your code with the existing structure
   - Test your features

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: Add [your feature name]

   - [List your main features]
   - [List your key implementations]
   - [Any important notes]
   
   Contributor: [Your Name]"
   ```

5. **Push your branch:**
   ```bash
   git push origin feature/[your-name]-[feature-name]
   ```

6. **Create a Pull Request:**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch to merge into main
   - Add description of your changes

## 🔧 **Integration Guidelines**

### **Code Integration:**
1. **Don't modify other team members' files directly**
2. **Use the existing file structure:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
3. **Follow the existing naming conventions**
4. **Add your code to the appropriate files**

### **Database Integration:**
- All team members share the same MongoDB Atlas database
- Use the existing models and schemas
- Don't create conflicting field names

### **API Integration:**
- Use the existing API structure
- Add your routes to the appropriate files
- Follow RESTful conventions

## 📝 **Commit Message Format**

```bash
git commit -m "feat: Add [feature name]

- [Feature 1 description]
- [Feature 2 description]
- [Integration notes]

Contributor: [Your Name]"
```

**Examples:**
```bash
git commit -m "feat: Add real-time chat system

- Implemented Socket.io for real-time messaging
- Added message persistence in MongoDB
- Created chat UI components
- Integrated with existing user system

Contributor: John Smith"
```

## 🧪 **Testing Your Features**

### **Before Committing:**
1. **Test your features locally:**
   ```bash
   # Start the app
   ./run.bat  # Windows
   ./run.sh   # Mac/Linux
   ```

2. **Test the specific functionality you added**
3. **Make sure it doesn't break existing features**
4. **Check for console errors**

### **Integration Testing:**
1. **Test with other team members' features**
2. **Make sure data flows correctly between features**
3. **Test the complete user journey**

## 🔄 **Workflow Process**

### **Daily Workflow:**
1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Work on your features**
3. **Test thoroughly**
4. **Commit and push your changes**

### **When Ready to Merge:**
1. **Create Pull Request**
2. **Add detailed description**
3. **Tag other team members for review**
4. **Merge after approval**

## 📋 **Feature Integration Checklist**

### **For Each Team Member:**
- [ ] Code is properly integrated
- [ ] No conflicts with existing code
- [ ] Database models are compatible
- [ ] API endpoints follow conventions
- [ ] Frontend components are responsive
- [ ] Error handling is implemented
- [ ] Code is documented
- [ ] Features are tested

### **For the Team:**
- [ ] All features work together
- [ ] No broken functionality
- [ ] Database is consistent
- [ ] UI is cohesive
- [ ] Performance is acceptable
- [ ] Security is maintained

## 🚨 **Common Issues & Solutions**

### **Merge Conflicts:**
```bash
# If you get merge conflicts
git pull origin main
# Resolve conflicts in your editor
git add .
git commit -m "Resolve merge conflicts"
```

### **Database Issues:**
- Check MongoDB Atlas connection
- Verify environment variables
- Check model schemas

### **API Issues:**
- Check route definitions
- Verify request/response formats
- Check authentication middleware

## 📞 **Communication**

### **GitHub Issues:**
- Use GitHub Issues for bugs and feature requests
- Tag team members using @username
- Use labels to categorize issues

### **Pull Request Reviews:**
- Review each other's code
- Provide constructive feedback
- Approve when ready

### **Daily Standups:**
- Share what you're working on
- Mention any blockers
- Coordinate integration efforts

## 🎯 **Final Integration**

### **Before Submission:**
1. **All team members have merged their features**
2. **Complete app is tested end-to-end**
3. **All features work together seamlessly**
4. **Code is clean and well-documented**
5. **README is updated with team contributions**

### **Final Commit:**
```bash
git commit -m "feat: Complete SkillShare team integration

- Integrated all 5 team contributions
- Added real-time chat system (John)
- Added video conferencing (Sarah)
- Added profile management (Mike)
- Added notifications and polish (Lisa)
- All features working together seamlessly

Team: [List all team members]"
```

## 🏆 **Success Criteria**

### **Individual Success:**
- [ ] Your feature is fully implemented
- [ ] Code is clean and documented
- [ ] Feature works independently
- [ ] Integration is smooth

### **Team Success:**
- [ ] All features work together
- [ ] Complete user journey is possible
- [ ] App is production-ready
- [ ] Lecturer can easily run and test

---

## 🎉 **Ready to Collaborate!**

**Follow this guide to ensure smooth team collaboration and create an amazing SkillShare application together!**

**Remember:** Communication is key. If you have questions or run into issues, don't hesitate to ask your team members for help.

**Good luck with your project! 🚀**
