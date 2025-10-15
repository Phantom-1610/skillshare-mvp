/**
 * Base matching system and user authentication
 * Handles user registration, login, and finding people to connect with
 */

// User registration and login functions
const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;
  
  // Check if user exists
  const exists = await User.findOne({ email });
  if (exists) throw new Error('User already exists');
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    bio: '',
    location: '',
    offeredSkills: [],
    desiredSkills: [],
    availability: { timezone: 'Asia/Colombo', schedule: [] }
  });
  
  // Generate JWT token
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
  
  return { user: publicUser(user), token };
};

// User Login (Backend)
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
  
  return { user: publicUser(user), token };
};

// Finding and matching users based on skills
const getAllUsers = async (currentUserId) => {
  const users = await User.find({ 
    _id: { $ne: currentUserId },
    isActive: true 
  }).select('-password');
  
  return users.map(user => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,
    offeredSkills: user.offeredSkills,
    desiredSkills: user.desiredSkills,
    rating: user.rating,
    sessionsAttended: user.sessionsAttended,
    sessionsTaught: user.sessionsTaught
  }));
};

// Skill-based matching algorithm
const findMatches = (currentUser, allUsers) => {
  return allUsers.filter(user => {
    // Check if current user's desired skills match user's offered skills
    const hasMatchingSkills = currentUser.desiredSkills.some(desiredSkill => 
      user.offeredSkills.some(offeredSkill => 
        offeredSkill.skill.toLowerCase() === desiredSkill.toLowerCase()
      )
    );
    
    // Check if user's desired skills match current user's offered skills
    const canTeachThem = user.desiredSkills.some(desiredSkill => 
      currentUser.offeredSkills.some(offeredSkill => 
        offeredSkill.skill.toLowerCase() === desiredSkill.toLowerCase()
      )
    );
    
    return hasMatchingSkills || canTeachThem;
  });
};

// Database structure for users
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },
  offeredSkills: [{ 
    skill: String, 
    level: String, 
    description: String 
  }],
  desiredSkills: [String],
  verificationDocs: [String],
  availability: {
    timezone: { type: String, default: 'Asia/Colombo' },
    schedule: [Object]
  },
  sessionsAttended: { type: Number, default: 0 },
  sessionsTaught: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// API endpoints for the app
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.json({
      success: true,
      message: 'Welcome to SkillShare!',
      data: result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users for matching
app.get('/api/users', auth, async (req, res) => {
  try {
    const users = await getAllUsers(req.userId);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Frontend page for browsing users
const ExplorePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    skill: '',
    level: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filters.location && user.location !== filters.location) return false;
    if (filters.skill && !user.offeredSkills.some(s => s.skill.toLowerCase().includes(filters.skill.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Discover People</h1>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select 
          value={filters.location} 
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Locations</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Online">Online</option>
        </select>
        
        <input
          type="text"
          placeholder="Search by skill..."
          value={filters.skill}
          onChange={(e) => setFilters({...filters, skill: e.target.value})}
          className="px-4 py-2 border rounded-lg flex-1"
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                {user.firstName.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600">{user.location}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{user.bio}</p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Skills I Can Teach:</h4>
              <div className="flex flex-wrap gap-2">
                {user.offeredSkills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-500">
                View Profile
              </button>
              <button className="border border-primary-400 text-primary-400 px-4 py-2 rounded hover:bg-primary-50">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
const publicUser = (user) => {
  const { password, ...publicData } = user.toObject();
  return publicData;
};

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  findMatches,
  UserSchema,
  ExplorePage,
  publicUser,
  auth
};
