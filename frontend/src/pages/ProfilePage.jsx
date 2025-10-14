import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Camera, Edit2, Save, X, Upload, Trash2, Plus, 
  Award, Star, Calendar, Clock, MessageCircle, Video,
  CheckCircle, FileText, Image as ImageIcon
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [stats, setStats] = useState({ sessionsAttended: 0, sessionsTaught: 0, rating: 0, reviews: [] });
  
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfile();
    if (!isOwnProfile) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
      } else {
        const response = await api.get(`/users/${userId}`);
        setProfile(response.data.data?.user || null);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      setStats(response.data.data || stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleProfileUpdate = async (updates) => {
    try {
      const response = await api.put('/users/profile', updates);
      const updatedUser = response.data.data?.user;
      setProfile(updatedUser);
      if (isOwnProfile) {
        updateUser(updatedUser);
      }
      toast.success('Profile updated!');
      setShowModal(null);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    console.log('📤 Starting upload:', { 
      fileName: file.name, 
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type,
      uploadType: type
    });

    // Check file size (10MB limit for documents)
    const maxSize = type === 'verification' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = type === 'verification' ? '10MB' : '5MB';
      toast.error(`File too large! Maximum size is ${maxSizeMB}`);
      console.error('❌ File size exceeded:', file.size, 'Max:', maxSize);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type! Only JPG, PNG, GIF, and PDF are allowed');
      console.error('❌ Invalid file type:', file.type);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    console.log('📦 FormData created with:', { file: file.name, type });

    try {
      const loadingToast = toast.loading(`Uploading ${type === 'avatar' ? 'profile picture' : 'document'}...`);
      
      console.log('🚀 Sending request to /users/upload...');
      const response = await api.post('/users/upload', formData);
      
      toast.dismiss(loadingToast);
      
      console.log('✅ Upload successful!', response.data);
      
      const updatedUser = response.data.data?.user;
      if (!updatedUser) {
        throw new Error('No user data returned from server');
      }
      
      // Update local state
      setProfile(updatedUser);
      if (isOwnProfile) {
        updateUser(updatedUser);
      }
      
      // Show success message
      if (type === 'avatar') {
        toast.success('✅ Profile picture uploaded successfully!', {
          duration: 3000,
          icon: '🎉'
        });
      } else {
        toast.success('✅ Document uploaded successfully!', {
          duration: 3000,
          icon: '📄'
        });
      }
      
      console.log('💾 Profile and database updated successfully!');
      console.log('📁 File saved to:', response.data.data?.fileUrl);
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.error || error.message || 'Upload failed. Please try again.');
    }
  };

  const handleAddSkill = async (skillData, type) => {
    try {
      const skills = type === 'offered' ? [...(profile.offeredSkills || []), skillData] : [...(profile.desiredSkills || []), skillData];
      await handleProfileUpdate({ [type === 'offered' ? 'offeredSkills' : 'desiredSkills']: skills });
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (index, type) => {
    try {
      const skills = type === 'offered' ? [...profile.offeredSkills] : [...profile.desiredSkills];
      skills.splice(index, 1);
      await handleProfileUpdate({ [type === 'offered' ? 'offeredSkills' : 'desiredSkills']: skills });
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      await api.post(`/users/${userId}/reviews`, reviewData);
      toast.success('Review submitted!');
      fetchUserStats();
      setShowModal(null);
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-300">Profile not found</h3>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">
          {isOwnProfile ? 'My Profile' : 'User Profile'}
        </h1>
        {!isOwnProfile && (
          <div className="flex gap-2">
            <Button onClick={() => navigate('/app/chat')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button onClick={() => setShowModal('review')}>
              <Star className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover" />
                ) : (
                  `${profile.firstName?.[0]}${profile.lastName?.[0]}`
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0], 'avatar');
                        e.target.value = ''; // Reset input
                      }
                    }}
                  />
                </label>
              )}
            </div>
            {profile.verified && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-400">{profile.email}</p>
                {profile.location && (
                  <p className="text-sm text-gray-500 mt-1">{profile.location}</p>
                )}
              </div>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal('basicInfo')}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Bio */}
            <div>
              {profile.bio ? (
                <p className="text-gray-300">{profile.bio}</p>
              ) : isOwnProfile ? (
                <button
                  onClick={() => setShowModal('basicInfo')}
                  className="text-sm text-primary-400 hover:text-primary-300"
                >
                  + Add bio
                </button>
              ) : null}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">
                  {isOwnProfile ? profile.sessionsAttended || 0 : stats.sessionsAttended}
                </div>
                <div className="text-xs text-gray-500">Sessions Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-400">
                  {isOwnProfile ? profile.sessionsTaught || 0 : stats.sessionsTaught}
                </div>
                <div className="text-xs text-gray-500">Sessions Taught</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  {isOwnProfile ? (profile.rating || 0).toFixed(1) : stats.rating.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills I Offer */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-400" />
            Skills I Teach
          </h3>
          {isOwnProfile && (
            <Button size="sm" onClick={() => setShowModal('addOfferedSkill')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile.offeredSkills || []).map((skill, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-primary-400/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-200">{skill.skill}</h4>
                    <Badge variant="primary" className="text-xs">{skill.level}</Badge>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  )}
                  {skill.verificationDoc && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => handleRemoveSkill(index, 'offered')}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!profile.offeredSkills || profile.offeredSkills.length === 0) && (
            <div className="col-span-full text-center py-8 text-gray-500">
              {isOwnProfile ? 'Add skills you can teach' : 'No skills listed yet'}
            </div>
          )}
        </div>
      </Card>

      {/* Skills I Want to Learn */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary-400" />
            Skills I Want to Learn
          </h3>
          {isOwnProfile && (
            <Button size="sm" onClick={() => setShowModal('addDesiredSkill')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile.desiredSkills || []).map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-2">
              {skill.skill}
              {isOwnProfile && (
                <button
                  onClick={() => handleRemoveSkill(index, 'desired')}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
          {(!profile.desiredSkills || profile.desiredSkills.length === 0) && (
            <div className="w-full text-center py-4 text-gray-500">
              {isOwnProfile ? 'Add skills you want to learn' : 'No skills listed yet'}
            </div>
          )}
        </div>
      </Card>

      {/* Skill Verification Documents - Visible to Everyone */}
      {(profile.verificationDocs && profile.verificationDocs.length > 0) || isOwnProfile ? (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" />
              Skill Verification Documents
              {profile.verificationDocs && profile.verificationDocs.length > 0 && (
                <Badge variant="success" className="ml-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </h3>
            {isOwnProfile && (
              <label className="cursor-pointer inline-block">
                <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleImageUpload(e.target.files[0], 'verification');
                      e.target.value = ''; // Reset input to allow same file upload
                    }
                  }}
                />
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(profile.verificationDocs || []).map((doc, index) => (
              <div key={index} className="relative group bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-primary-400/50 transition-colors">
                {doc.endsWith('.pdf') ? (
                  <a 
                    href={doc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-32 flex flex-col items-center justify-center bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-400">View PDF</span>
                  </a>
                ) : (
                  <a 
                    href={doc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img src={doc} alt="Verification" className="w-full h-32 object-cover rounded hover:opacity-80 transition-opacity" />
                  </a>
                )}
                {isOwnProfile && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete this document?')) {
                        const docs = [...profile.verificationDocs];
                        docs.splice(index, 1);
                        await handleProfileUpdate({ verificationDocs: docs });
                      }
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {(!profile.verificationDocs || profile.verificationDocs.length === 0) && isOwnProfile && (
            <div className="text-center py-8 text-gray-500">
              Upload certificates, diplomas, or portfolio samples to verify your skills
            </div>
          )}
        </Card>
      ) : null}

      {/* Reviews Section (Other Users' Profiles) */}
      {!isOwnProfile && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Reviews & Ratings
          </h3>
          <div className="space-y-4">
            {stats.reviews?.length > 0 ? (
              stats.reviews.map((review, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold text-white">
                        {review.reviewerName?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200">{review.reviewerName}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-LK')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No reviews yet</div>
            )}
          </div>
        </Card>
      )}

      {/* Modals */}
      {showModal === 'basicInfo' && <BasicInfoModal profile={profile} onSave={handleProfileUpdate} onClose={() => setShowModal(null)} />}
      {showModal === 'addOfferedSkill' && <AddSkillModal type="offered" onSave={(data) => handleAddSkill(data, 'offered')} onClose={() => setShowModal(null)} />}
      {showModal === 'addDesiredSkill' && <AddSkillModal type="desired" onSave={(data) => handleAddSkill(data, 'desired')} onClose={() => setShowModal(null)} />}
      {showModal === 'review' && <ReviewModal onSave={handleAddReview} onClose={() => setShowModal(null)} />}
    </div>
  );
};

// Basic Info Modal
const BasicInfoModal = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    bio: profile.bio || '',
    location: profile.location || ''
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
            >
              <option value="">Select location</option>
              <option value="Online">Online</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Add Skill Modal
const AddSkillModal = ({ type, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    skill: '',
    level: 'Beginner',
    description: ''
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">
            Add {type === 'offered' ? 'Skill to Teach' : 'Skill to Learn'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
            <input
              type="text"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              placeholder="e.g., Python, Guitar, Painting"
            />
          </div>
          {type === 'offered' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none resize-none"
                  placeholder="Brief description of your expertise..."
                />
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(formData); onClose(); }} disabled={!formData.skill}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>
    </div>
  );
};

// Review Modal
const ReviewModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Write a Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none resize-none"
              placeholder="Share your experience..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(formData)} disabled={!formData.comment}>
            <Star className="w-4 h-4 mr-2" />
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
