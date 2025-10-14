import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Users, Calendar, MessageCircle, X, Send, Check, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { socketService } from '../services/socketService';

const ExplorePage = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const allUsers = response.data.data?.users || [];
      // Filter out current user
      const otherUsers = allUsers.filter(u => u.id !== user?.id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to hardcoded Sri Lankan users if API fails
      setUsers([
      // Sinhalese Buddhist
      {
        id: '2',
        firstName: 'Nimali',
        lastName: 'Perera',
        bio: 'Data scientist passionate about AI and machine learning. Teaching Python and data analysis.',
        location: 'Colombo',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Python', level: 'expert', description: '7+ years experience' },
          { skill: 'Machine Learning', level: 'advanced', description: '4+ years experience' },
          { skill: 'Data Analysis', level: 'expert', description: '5+ years experience' }
        ],
        desiredSkills: [
          { skill: 'JavaScript', level: 'intermediate', priority: 'high' },
          { skill: 'React', level: 'beginner', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.9,
          totalRatings: 23,
          sessionsTaught: 15,
          sessionsAttended: 8
        },
        isOnline: true
      },
      // Tamil Hindu
      {
        id: '3',
        firstName: 'Priya',
        lastName: 'Rajendran',
        bio: 'Full-stack developer specializing in React and Node.js. Love teaching web development.',
        location: 'Kandy',
        profilePicture: '',
        offeredSkills: [
          { skill: 'React', level: 'expert', description: '6+ years experience' },
          { skill: 'Node.js', level: 'advanced', description: '5+ years experience' },
          { skill: 'JavaScript', level: 'expert', description: '7+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Python', level: 'beginner', priority: 'high' },
          { skill: 'Machine Learning', level: 'intermediate', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.7,
          totalRatings: 18,
          sessionsTaught: 12,
          sessionsAttended: 6
        },
        isOnline: false
      },
      // Muslim
      {
        id: '4',
        firstName: 'Fahim',
        lastName: 'Mohamed',
        bio: 'UI/UX Designer creating beautiful digital experiences. Expert in Figma and Adobe Creative Suite.',
        location: 'Colombo',
        profilePicture: '',
        offeredSkills: [
          { skill: 'UI Design', level: 'expert', description: '8+ years experience' },
          { skill: 'UX Research', level: 'advanced', description: '5+ years experience' },
          { skill: 'Figma', level: 'expert', description: '6+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Web Development', level: 'beginner', priority: 'high' },
          { skill: 'Animation', level: 'intermediate', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.8,
          totalRatings: 31,
          sessionsTaught: 20,
          sessionsAttended: 10
        },
        isOnline: true
      },
      // Sinhalese Christian
      {
        id: '5',
        firstName: 'Dinesh',
        lastName: 'Fernando',
        bio: 'Mobile app developer with expertise in React Native and Flutter. Building apps for social good.',
        location: 'Online',
        profilePicture: '',
        offeredSkills: [
          { skill: 'React Native', level: 'expert', description: '5+ years experience' },
          { skill: 'Flutter', level: 'advanced', description: '3+ years experience' },
          { skill: 'Mobile Development', level: 'expert', description: '6+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Backend Development', level: 'intermediate', priority: 'high' },
          { skill: 'Cloud Computing', level: 'beginner', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.6,
          totalRatings: 14,
          sessionsTaught: 8,
          sessionsAttended: 12
        },
        isOnline: true
      },
      // Tamil Christian
      {
        id: '6',
        firstName: 'Reena',
        lastName: 'Daniels',
        bio: 'Digital marketing expert and graphic designer. Helping businesses grow through creative strategies.',
        location: 'Kandy',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Digital Marketing', level: 'expert', description: '6+ years experience' },
          { skill: 'Graphic Design', level: 'advanced', description: '5+ years experience' },
          { skill: 'Social Media', level: 'expert', description: '4+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Video Editing', level: 'intermediate', priority: 'high' },
          { skill: 'Photography', level: 'beginner', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.9,
          totalRatings: 27,
          sessionsTaught: 18,
          sessionsAttended: 9
        },
        isOnline: true
      },
      // Burgher
      {
        id: '7',
        firstName: 'Brandon',
        lastName: 'Van Dort',
        bio: 'Cybersecurity specialist and ethical hacker. Teaching security best practices and penetration testing.',
        location: 'Colombo',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Cybersecurity', level: 'expert', description: '8+ years experience' },
          { skill: 'Ethical Hacking', level: 'advanced', description: '6+ years experience' },
          { skill: 'Network Security', level: 'expert', description: '7+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Cloud Security', level: 'intermediate', priority: 'high' },
          { skill: 'Blockchain', level: 'beginner', priority: 'low' }
        ],
        stats: {
          averageRating: 4.8,
          totalRatings: 19,
          sessionsTaught: 13,
          sessionsAttended: 7
        },
        isOnline: false
      },
      // Malay Muslim
      {
        id: '8',
        firstName: 'Zainab',
        lastName: 'Noordeen',
        bio: 'Content writer and language tutor. Fluent in English, Sinhala, and Tamil. Teaching creative writing.',
        location: 'Online',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Content Writing', level: 'expert', description: '5+ years experience' },
          { skill: 'English Language', level: 'expert', description: '10+ years experience' },
          { skill: 'Creative Writing', level: 'advanced', description: '6+ years experience' }
        ],
        desiredSkills: [
          { skill: 'SEO', level: 'intermediate', priority: 'high' },
          { skill: 'Copywriting', level: 'beginner', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.9,
          totalRatings: 35,
          sessionsTaught: 25,
          sessionsAttended: 12
        },
        isOnline: true
      },
      // Sinhalese Buddhist
      {
        id: '9',
        firstName: 'Kasun',
        lastName: 'Wickramasinghe',
        bio: 'DevOps engineer and cloud architect. Expertise in AWS, Docker, and Kubernetes.',
        location: 'Kandy',
        profilePicture: '',
        offeredSkills: [
          { skill: 'DevOps', level: 'expert', description: '6+ years experience' },
          { skill: 'AWS', level: 'advanced', description: '5+ years experience' },
          { skill: 'Docker', level: 'expert', description: '4+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Terraform', level: 'intermediate', priority: 'high' },
          { skill: 'Kubernetes', level: 'advanced', priority: 'high' }
        ],
        stats: {
          averageRating: 4.7,
          totalRatings: 16,
          sessionsTaught: 11,
          sessionsAttended: 8
        },
        isOnline: true
      },
      // Tamil Muslim
      {
        id: '10',
        firstName: 'Aisha',
        lastName: 'Farook',
        bio: 'Business analyst and project manager. Helping teams deliver successful projects using Agile methodologies.',
        location: 'Colombo',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Project Management', level: 'expert', description: '7+ years experience' },
          { skill: 'Business Analysis', level: 'advanced', description: '6+ years experience' },
          { skill: 'Agile', level: 'expert', description: '5+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Data Analytics', level: 'intermediate', priority: 'high' },
          { skill: 'Power BI', level: 'beginner', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.8,
          totalRatings: 22,
          sessionsTaught: 14,
          sessionsAttended: 10
        },
        isOnline: false
      },
      // Sinhalese Hindu
      {
        id: '11',
        firstName: 'Kavinda',
        lastName: 'Silva',
        bio: 'Game developer and 3D artist. Creating immersive experiences with Unity and Unreal Engine.',
        location: 'Online',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Game Development', level: 'expert', description: '6+ years experience' },
          { skill: 'Unity', level: 'advanced', description: '5+ years experience' },
          { skill: '3D Modeling', level: 'expert', description: '7+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Unreal Engine', level: 'intermediate', priority: 'high' },
          { skill: 'Animation', level: 'advanced', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.6,
          totalRatings: 12,
          sessionsTaught: 9,
          sessionsAttended: 6
        },
        isOnline: true
      },
      // Tamil Catholic
      {
        id: '12',
        firstName: 'Joseph',
        lastName: 'Antony',
        bio: 'Photographer and videographer. Specializing in portrait and event photography. Teaching visual storytelling.',
        location: 'Kandy',
        profilePicture: '',
        offeredSkills: [
          { skill: 'Photography', level: 'expert', description: '9+ years experience' },
          { skill: 'Video Editing', level: 'advanced', description: '6+ years experience' },
          { skill: 'Adobe Premiere', level: 'expert', description: '7+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Drone Photography', level: 'intermediate', priority: 'high' },
          { skill: 'Color Grading', level: 'advanced', priority: 'medium' }
        ],
        stats: {
          averageRating: 4.9,
          totalRatings: 28,
          sessionsTaught: 19,
          sessionsAttended: 11
        },
        isOnline: false
      }
    ]);
    }
  };

  const filteredUsers = users.filter(userData => {
    const matchesSearch = !searchTerm || 
      userData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.offeredSkills.some(skill => 
        skill.skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSkill = !selectedSkill || 
      userData.offeredSkills.some(skill => 
        skill.skill.toLowerCase().includes(selectedSkill.toLowerCase())
      );

    const matchesLocation = !selectedLocation || 
      userData.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesSkill && matchesLocation;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.stats.averageRating - a.stats.averageRating;
      case 'sessions':
        return b.stats.sessionsTaught - a.stats.sessionsTaught;
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const allSkills = [...new Set(users.flatMap(u => u.offeredSkills?.map(s => s.skill) || []))];
  // Fixed locations for Sri Lankan context
  const sriLankanLocations = ['Online', 'Colombo', 'Kandy'];

  // Open chat modal
  const openChat = (userData) => {
    setSelectedUser(userData);
    setChatModalOpen(true);
  };

  // Open profile page
  const openProfile = (userData) => {
    navigate(`/app/profile/${userData.id}`);
  };

  // Send message and save to backend
  const sendMessage = async () => {
    if (!chatMessage.trim() || !selectedUser) return;

    try {
      // Check if user is logged in
      if (!token || !user) {
        alert('Please log in to send messages');
        return;
      }

      const messageData = {
        recipientId: selectedUser.id,
        content: chatMessage.trim(),
        type: 'text'
      };

      console.log('Sending message:', messageData);
      console.log('User token exists:', !!token);

      // Save to backend via API - Note: uses /api/messages endpoint
      try {
        const response = await api.post('/messages', messageData);
        console.log('✅ Message sent successfully:', response.data);
      } catch (apiError) {
        console.warn('API save failed (might be 404), continuing with Socket.io:', apiError.message);
        // Continue even if API fails - socket.io will handle it
      }

      // Send via Socket.io for real-time delivery
      if (token) {
        socketService.connect(token);
        socketService.sendMessage(messageData);
      }
      
      setChatMessage('');
      setChatModalOpen(false);
      
      // Navigate to chat page with this conversation
      navigate(`/app/chat/${selectedUser.id}`);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show detailed error
      const errorMsg = error.response?.data?.error || error.message || 'Failed to send message';
      alert(`Error: ${errorMsg}\n\nPlease check the console for details.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200 mb-2">Explore Skills</h1>
        <p className="text-gray-400">Discover peers to learn from and teach</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skill, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-400 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              >
                <option value="">All Skills</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              >
                <option value="">All Locations</option>
                {sriLankanLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="sessions">Most Sessions</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('');
                  setSelectedLocation('');
                  setSortBy('relevance');
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedUsers.map((userData) => (
          <Card key={userData.id} className="hover:border-gray-600 transition-colors">
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center overflow-hidden">
                  {userData.avatar || userData.profilePicture ? (
                    <img 
                      src={userData.avatar || userData.profilePicture} 
                      alt={`${userData.firstName} ${userData.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-white">
                      {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                {userData.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                )}
                {userData.verificationDocs && userData.verificationDocs.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-gray-900 rounded-full flex items-center justify-center" title="Verified Skills">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-200">
                      {userData.firstName} {userData.lastName}
                    </h3>
                    {userData.verificationDocs && userData.verificationDocs.length > 0 && (
                      <Badge variant="success" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-200">
                      {userData.rating || userData.stats?.averageRating || 0}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{userData.location}</span>
                </div>
                
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {userData.bio}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Offers:</h4>
              <div className="flex flex-wrap gap-2">
                {userData.offeredSkills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="primary" className="text-xs">
                    {skill.skill} ({skill.level})
                  </Badge>
                ))}
                {userData.offeredSkills.length > 3 && (
                  <Badge variant="gray" className="text-xs">
                    +{userData.offeredSkills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Wants to learn:</h4>
              <div className="flex flex-wrap gap-2">
                {userData.desiredSkills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill.skill}
                  </Badge>
                ))}
                {userData.desiredSkills.length > 2 && (
                  <Badge variant="gray" className="text-xs">
                    +{userData.desiredSkills.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-200">
                  {userData.stats.sessionsTaught}
                </div>
                <div className="text-xs text-gray-400">Taught</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-200">
                  {userData.stats.sessionsAttended}
                </div>
                <div className="text-xs text-gray-400">Learned</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-200">
                  {userData.stats.totalRatings}
                </div>
                <div className="text-xs text-gray-400">Reviews</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={async () => {
                  try {
                    await api.post('/match-requests', { receiverId: userData.id });
                    toast.success('Match request sent!');
                  } catch (err) {
                    toast.error(err.response?.data?.error || 'Failed to send request');
                  }
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Request Match
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openChat(userData)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="flex-1"
                  onClick={() => openProfile(userData)}
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Check Matches Button */}
      <div className="flex justify-center">
        <Link to="/app/matches">
          <Button className="px-8 py-3">
            <Users className="w-5 h-5 mr-2" />
            Check My Matches
          </Button>
        </Link>
      </div>

      {/* Chat Modal */}
      {chatModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-xs text-gray-400">{selectedUser.location}</p>
                </div>
              </div>
              <button 
                onClick={() => setChatModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="text-sm text-gray-400 mb-4">
                Send a message to {selectedUser.firstName}
              </p>
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-400 focus:outline-none resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => setChatModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={sendMessage}
                disabled={!chatMessage.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send & Open Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
