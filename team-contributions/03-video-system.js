/**
 * TEAM CONTRIBUTION #3 - VIDEO SYSTEM
 * Contributor: [Team Member 3]
 * Features: Video calls, session scheduling, Jitsi Meet integration
 * 
 * This file contains the video conferencing functionality including:
 * - Jitsi Meet integration for video calls
 * - Session scheduling and management
 * - Video call UI components
 * - Meeting room generation
 */

// ============================================================================
// SESSION MODEL
// ============================================================================

const SessionSchema = new mongoose.Schema({
  title: String,
  description: String,
  skill: String,
  teacher: { type: String, ref: 'User' },
  student: { type: String, ref: 'User' },
  scheduledAt: Date,
  duration: Number, // in minutes
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled' 
  },
  meetingUrl: String,
  meetingId: String,
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', SessionSchema);

// ============================================================================
// VIDEO CALL INTEGRATION
// ============================================================================

// Generate unique meeting ID
const generateMeetingId = () => {
  return 'skillshare-' + Math.random().toString(36).substr(2, 9);
};

// Create Jitsi Meet meeting URL
const createMeetingUrl = (meetingId, roomName) => {
  const baseUrl = 'https://meet.jit.si/';
  const roomNameParam = roomName ? `?room=${encodeURIComponent(roomName)}` : '';
  return `${baseUrl}${meetingId}${roomNameParam}`;
};

// ============================================================================
// SESSION API ROUTES
// ============================================================================

// Get user's sessions
app.get('/api/sessions', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const sessions = await Session.find({
      $or: [{ teacher: userId }, { student: userId }]
    })
    .populate('teacher', 'firstName lastName email')
    .populate('student', 'firstName lastName email')
    .sort({ scheduledAt: -1 });
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session
app.post('/api/sessions', auth, async (req, res) => {
  try {
    const { title, description, skill, teacherId, scheduledAt, duration } = req.body;
    const studentId = req.userId;
    
    // Generate meeting details
    const meetingId = generateMeetingId();
    const meetingUrl = createMeetingUrl(meetingId, `${skill}-session`);
    
    const session = await Session.create({
      title,
      description,
      skill,
      teacher: teacherId,
      student: studentId,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      meetingUrl,
      meetingId
    });
    
    // Populate user details
    await session.populate('teacher', 'firstName lastName email');
    await session.populate('student', 'firstName lastName email');
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session status
app.put('/api/sessions/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const sessionId = req.params.id;
    
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    ).populate('teacher', 'firstName lastName email')
     .populate('student', 'firstName lastName email');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End session
app.put('/api/sessions/:id/end', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { 
        status: 'completed',
        endedAt: new Date()
      },
      { new: true }
    ).populate('teacher', 'firstName lastName email')
     .populate('student', 'firstName lastName email');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// FRONTEND VIDEO COMPONENTS
// ============================================================================

// Video Session Page Component
const VideoSessionPage = ({ sessionId }) => {
  const [session, setSession] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      setSession(response.data.data);
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const startCall = () => {
    setCallStarted(true);
    setIsInCall(true);
  };

  const endCall = async () => {
    try {
      await api.put(`/sessions/${sessionId}/end`);
      setIsInCall(false);
      setCallStarted(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      {!callStarted ? (
        // Pre-call screen
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{session.title}</h1>
            <p className="text-gray-300 mb-6">{session.description}</p>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Session Details</h3>
              <div className="space-y-2">
                <p><strong>Skill:</strong> {session.skill}</p>
                <p><strong>Teacher:</strong> {session.teacher.firstName} {session.teacher.lastName}</p>
                <p><strong>Student:</strong> {session.student.firstName} {session.student.lastName}</p>
                <p><strong>Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
                <p><strong>Duration:</strong> {session.duration} minutes</p>
              </div>
            </div>
            
            <button
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Start Video Call
            </button>
          </div>
        </div>
      ) : (
        // Video call screen
        <div className="h-full flex flex-col">
          {/* Video Container */}
          <div className="flex-1 relative">
            <iframe
              src={session.meetingUrl}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; speaker; display-capture"
              title="Video Call"
            />
          </div>
          
          {/* Call Controls */}
          <div className="bg-gray-800 p-4 flex justify-center space-x-4">
            <button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sessions Page Component
const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSessions();
    fetchMatchedUsers();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchedUsers = async () => {
    try {
      const response = await api.get('/users/matches');
      setMatchedUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const createSession = async (sessionData) => {
    try {
      await api.post('/sessions', sessionData);
      setShowCreateModal(false);
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading sessions...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500"
        >
          Schedule Session
        </button>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
          <div key={session._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{session.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{session.description}</p>
            
            <div className="space-y-2 mb-4">
              <p><strong>Skill:</strong> {session.skill}</p>
              <p><strong>Teacher:</strong> {session.teacher.firstName} {session.teacher.lastName}</p>
              <p><strong>Student:</strong> {session.student.firstName} {session.student.lastName}</p>
              <p><strong>Date:</strong> {new Date(session.scheduledAt).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(session.scheduledAt).toLocaleTimeString()}</p>
              <p><strong>Duration:</strong> {session.duration} minutes</p>
            </div>
            
            <div className="flex space-x-2">
              {session.status === 'scheduled' && (
                <Link
                  to={`/app/video/${session._id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Join Call
                </Link>
              )}
              {session.status === 'completed' && (
                <span className="text-green-600 font-medium">Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal
          matchedUsers={matchedUsers}
          onCreateSession={createSession}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

// Create Session Modal Component
const CreateSessionModal = ({ matchedUsers, onCreateSession, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skill: '',
    teacherId: '',
    scheduledAt: '',
    duration: 60
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSession(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Schedule New Session</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Skill</label>
            <input
              type="text"
              value={formData.skill}
              onChange={(e) => setFormData({...formData, skill: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Teacher</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            >
              <option value="">Select a teacher</option>
              {matchedUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              min="15"
              max="180"
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-400 text-white py-2 rounded-lg hover:bg-primary-500"
            >
              Schedule Session
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

module.exports = {
  SessionSchema,
  Session,
  VideoSessionPage,
  SessionsPage,
  CreateSessionModal,
  generateMeetingId,
  createMeetingUrl
};
