/**
 * User profile management
 * Handles profile editing, file uploads, and skill verification
 * 
 * Developed by: Aashif
 */

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG, GIF) and PDFs are allowed!'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ============================================================================
// REVIEW MODEL
// ============================================================================

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User' },
  reviewerId: { type: String, ref: 'User' },
  reviewerName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

// ============================================================================
// PROFILE API ROUTES
// ============================================================================

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file (avatar or verification document)
app.post('/api/users/upload', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const { type } = req.body; // 'avatar' or 'verification'
      const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      
      const user = await User.findById(req.userId);
      if (!user) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (type === 'avatar') {
        // Delete old avatar if exists
        if (user.avatar) {
          const oldFilePath = path.join(uploadsDir, path.basename(user.avatar));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        user.avatar = fileUrl;
      } else if (type === 'verification') {
        user.verificationDocs.push(fileUrl);
      } else {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Invalid upload type. Use "avatar" or "verification".' });
      }
      
      await user.save();
      
      res.json({
        success: true,
        message: `${type === 'avatar' ? 'Profile picture' : 'Document'} uploaded successfully`,
        data: {
          user: publicUser(user),
          fileUrl
        }
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  });
});

// Get user profile by ID
app.get('/api/users/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's reviews
    const reviews = await Review.find({ userId }).populate('reviewerId', 'firstName lastName');
    
    res.json({
      success: true,
      data: {
        user: publicUser(user),
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add skill to user profile
app.post('/api/users/skills/offered', auth, async (req, res) => {
  try {
    const { skill, level, description } = req.body;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.offeredSkills.push({ skill, level, description });
    await user.save();
    
    res.json({
      success: true,
      data: user.offeredSkills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove skill from user profile
app.delete('/api/users/skills/offered/:skillId', auth, async (req, res) => {
  try {
    const skillId = req.params.skillId;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.offeredSkills = user.offeredSkills.filter(skill => skill._id.toString() !== skillId);
    await user.save();
    
    res.json({
      success: true,
      data: user.offeredSkills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add desired skill
app.post('/api/users/skills/desired', auth, async (req, res) => {
  try {
    const { skill } = req.body;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.desiredSkills.includes(skill)) {
      user.desiredSkills.push(skill);
      await user.save();
    }
    
    res.json({
      success: true,
      data: user.desiredSkills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove desired skill
app.delete('/api/users/skills/desired/:skill', auth, async (req, res) => {
  try {
    const skill = decodeURIComponent(req.params.skill);
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.desiredSkills = user.desiredSkills.filter(s => s !== skill);
    await user.save();
    
    res.json({
      success: true,
      data: user.desiredSkills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit review for a user
app.post('/api/users/:userId/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.params.userId;
    const reviewerId = req.userId;
    
    if (userId === reviewerId) {
      return res.status(400).json({ error: 'Cannot review yourself' });
    }
    
    // Check if user already reviewed this person
    const existingReview = await Review.findOne({ userId, reviewerId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this user' });
    }
    
    const reviewer = await User.findById(reviewerId);
    if (!reviewer) {
      return res.status(404).json({ error: 'Reviewer not found' });
    }
    
    const review = await Review.create({
      userId,
      reviewerId,
      reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
      rating,
      comment
    });
    
    // Update user's average rating
    const reviews = await Review.find({ userId });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(userId, { rating: averageRating });
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// FRONTEND PROFILE COMPONENTS
// ============================================================================

// Profile Page Component
const ProfilePage = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      setIsOwnProfile(userId === currentUser?.id);
    }
  }, [userId, currentUser?.id]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data.data.user);
      setReviews(response.data.data.reviews);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await api.post('/users/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setUser(response.data.data.user);
        // Show success message
        alert(`${type === 'avatar' ? 'Profile picture' : 'Document'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-64">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-primary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.firstName?.charAt(0)
              )}
            </div>
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'avatar')}
                  className="hidden"
                />
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              {user.verificationDocs?.length > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-2">{user.location}</p>
            <p className="text-gray-700">{user.bio}</p>
            
            {/* Stats */}
            <div className="flex space-x-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{user.sessionsTaught || 0}</div>
                <div className="text-sm text-gray-600">Sessions Taught</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{user.sessionsAttended || 0}</div>
                <div className="text-sm text-gray-600">Sessions Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{user.rating?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            {isOwnProfile ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500">
                  Message
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="border border-primary-400 text-primary-400 px-4 py-2 rounded-lg hover:bg-primary-50"
                >
                  Write Review
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offered Skills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Skills I Can Teach</h3>
          <div className="space-y-3">
            {user.offeredSkills?.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{skill.skill}</h4>
                    <p className="text-sm text-gray-600">Level: {skill.level}</p>
                    {skill.description && (
                      <p className="text-sm text-gray-700 mt-1">{skill.description}</p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <button className="text-red-500 hover:text-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isOwnProfile && (
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-primary-400 hover:text-primary-400">
                + Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Desired Skills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Skills I Want to Learn</h3>
          <div className="flex flex-wrap gap-2">
            {user.desiredSkills?.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill}
                {isOwnProfile && (
                  <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                )}
              </span>
            ))}
            {isOwnProfile && (
              <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                + Add Skill
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Documents */}
      {user.verificationDocs?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Verification Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.verificationDocs.map((doc, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <a href={doc} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-400 hover:underline">
                  View Document
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h3>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">{review.reviewerName}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-gray-500 text-center py-4">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

module.exports = {
  ReviewSchema,
  Review,
  ProfilePage,
  upload
};
