# Developer Guide 🛠️

**Everything you need to know to work with SkillShare as a developer.**

## 🏗️ Architecture Overview

SkillShare is built with a modern, scalable architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   (Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Development Setup

### Prerequisites
- Node.js 16+
- Git
- Code editor (VS Code recommended)

### Quick Start
```bash
git clone https://github.com/phan16tom-collab/skillshare-mvp.git
cd skillshare-mvp
setup.bat  # Windows
# or
./setup.sh  # Mac/Linux
```

### Manual Setup
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection

# Frontend
cd ../frontend
npm install

# Start both
npm run dev  # Frontend
node src/server.js  # Backend
```

## 📁 Code Structure

### Backend (`/backend`)
```
src/
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── services/       # Business logic
└── server.js       # Main server file
```

### Frontend (`/frontend`)
```
src/
├── components/     # Reusable UI components
│   ├── auth/       # Authentication components
│   ├── layout/     # Header, sidebar, etc.
│   └── ui/         # Basic UI elements
├── pages/          # Page components
├── services/       # API calls, socket connections
├── stores/         # State management (Zustand)
└── styles/         # CSS and styling
```

## 🔧 Key Technologies

### Backend Stack
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads

### Frontend Stack
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Socket.io Client** - Real-time features

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  location: String,
  avatar: String,
  offeredSkills: [{
    skill: String,
    level: String,
    description: String
  }],
  desiredSkills: [String],
  verificationDocs: [String],
  sessionsAttended: Number,
  sessionsTaught: Number,
  rating: Number
}
```

### Message Model
```javascript
{
  threadId: String,
  sender: String (User ID),
  recipient: String (User ID),
  content: String,
  type: String (text/image),
  status: String (sent/delivered/read),
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload` - Upload files

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id/end` - End session

## 🔄 Real-time Features

### Socket.io Events
- `new-message` - New message received
- `new-notification` - New notification
- `user-online` - User comes online
- `user-offline` - User goes offline

### Implementation
```javascript
// Frontend
socketService.on('new-message', (message) => {
  // Handle new message
});

// Backend
io.emit('new-message', messageData);
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- Use utility classes for styling
- Follow mobile-first approach
- Use consistent color scheme:
  - Primary: `bg-primary-400`
  - Secondary: `bg-gray-800`
  - Success: `bg-green-500`
  - Error: `bg-red-500`

### Component Structure
```jsx
const Component = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Event handling
  };
  
  // Render
  return (
    <div className="container mx-auto p-4">
      {/* JSX */}
    </div>
  );
};
```

## 🧪 Testing

### Manual Testing
1. Test user registration/login
2. Test profile updates
3. Test messaging functionality
4. Test video calls
5. Test session scheduling

### Database Testing
```bash
cd backend
node -e "
import mongoose from 'mongoose';
// Test database connection
"
```

## 🚀 Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

### Production Checklist
- [ ] Environment variables set
- [ ] Database connection working
- [ ] File uploads configured
- [ ] CORS settings correct
- [ ] Error handling in place
- [ ] Logging configured

## 🐛 Common Issues

### Backend Issues
- **Database connection fails**: Check MongoDB Atlas credentials
- **File upload fails**: Check multer configuration
- **CORS errors**: Update CORS settings in server.js

### Frontend Issues
- **Socket connection fails**: Check Socket.io configuration
- **API calls fail**: Check API base URL
- **Styling issues**: Check Tailwind CSS classes

## 📝 Code Style

### JavaScript/React
- Use ES6+ features
- Prefer functional components
- Use hooks for state management
- Follow React best practices

### Naming Conventions
- Components: PascalCase (`UserProfile`)
- Functions: camelCase (`handleClick`)
- Variables: camelCase (`userName`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🔍 Debugging

### Backend Debugging
```javascript
console.log('Debug info:', data);
// Use VS Code debugger
// Check MongoDB Atlas logs
```

### Frontend Debugging
```javascript
console.log('Component state:', state);
// Use React DevTools
// Check browser console
```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Pull Request Guidelines
- Clear description of changes
- Include screenshots if UI changes
- Test all functionality
- Follow code style guidelines

---

**Happy coding! 🚀**

*For questions or help, check the main README or create an issue on GitHub.*
