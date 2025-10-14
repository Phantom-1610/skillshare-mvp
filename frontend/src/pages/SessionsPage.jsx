import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Plus, X, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import toast from 'react-hot-toast';

const SessionsPage = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    skill: '',
    teacherId: '',
    scheduledAt: '',
    duration: 60
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, matchesRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/match-requests')
      ]);
      setSessions(sessionsRes.data.data?.sessions || []);
      setMatches(matchesRes.data.data?.matches || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      await api.post('/sessions', newSession);
      toast.success('Session scheduled! Both participants have been notified.');
      setShowCreateModal(false);
      setNewSession({
        title: '',
        description: '',
        skill: '',
        teacherId: '',
        scheduledAt: '',
        duration: 60
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule session');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await api.put(`/sessions/${sessionId}/end`);
      toast.success('Session marked as completed');
      setActiveSession(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      timeZone: 'Asia/Colombo',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }

  // Video Call View
  if (activeSession) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 flex flex-col">
        {/* Elegant Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-primary-400/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveSession(null)}
                className="border-primary-400/50 hover:bg-primary-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="border-l border-gray-600 pl-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-100">{activeSession.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Badge variant="primary" className="text-xs">{activeSession.skill}</Badge>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{activeSession.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                if (window.confirm('Are you sure you want to end this session?')) {
                  handleEndSession(activeSession._id || activeSession.id);
                }
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
            >
              End Session
            </Button>
          </div>
        </div>

        {/* Video Call Container with Elegant Frame */}
        <div className="flex-1 p-6">
          <div className="h-full bg-black rounded-2xl shadow-2xl border border-primary-400/20 overflow-hidden relative">
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary-400/50 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-secondary-400/50 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-secondary-400/50 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary-400/50 rounded-br-2xl"></div>
            
            {/* Jitsi Meet Embed */}
            <iframe
              src={activeSession.meetingUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full rounded-2xl"
              style={{ border: 'none' }}
            />
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-primary-400/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Session in Progress</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(activeSession.scheduledAt)}</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">
              Powered by Jitsi Meet • End-to-End Encrypted
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sessions List View
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Sessions</h1>
          <p className="text-gray-400">Schedule and manage your skill exchange sessions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-16 text-center bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-700">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">No sessions yet</h3>
            <p className="text-gray-400 mb-8">Start your learning journey by scheduling a session with your matches</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Your First Session
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const isActive = isUpcoming(session.scheduledAt) && session.status !== 'completed';
            const isCompleted = session.status === 'completed';
            
            return (
              <Card 
                key={session._id || session.id} 
                className={`p-6 transition-all hover:shadow-xl hover:scale-[1.02] ${
                  isActive ? 'border-primary-400/50 bg-gradient-to-br from-gray-800 to-gray-900' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-green-500 animate-pulse' : 
                        isCompleted ? 'bg-gray-500' : 'bg-yellow-500'
                      }`}></div>
                      <h3 className="font-bold text-gray-100 text-lg">{session.title}</h3>
                    </div>
                    <Badge variant="primary" className="text-xs">
                      {session.skill}
                    </Badge>
                  </div>
                  <Badge variant={
                    isCompleted ? 'secondary' : 
                    isActive ? 'success' : 'warning'
                  }>
                    {isCompleted ? 'Completed' : isActive ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>

                {session.description && (
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-300">{session.description}</p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/30 rounded-lg p-2">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span>{formatDate(session.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/30 rounded-lg p-2">
                    <Clock className="w-4 h-4 text-secondary-400" />
                    <span>{session.duration} minutes</span>
                  </div>
                </div>

                {isActive && (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg group"
                    onClick={() => setActiveSession(session)}
                  >
                    <Video className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Join Video Call
                  </Button>
                )}

                {isCompleted && (
                  <div className="text-center py-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-500">Session completed</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200">Schedule Session</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                  placeholder="e.g., Python Basics Lesson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none resize-none"
                  placeholder="What will you cover in this session?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill
                </label>
                <input
                  type="text"
                  value={newSession.skill}
                  onChange={(e) => setNewSession({ ...newSession, skill: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                  placeholder="e.g., Python, Guitar, Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Match With
                </label>
                <select
                  value={newSession.teacherId}
                  onChange={(e) => setNewSession({ ...newSession, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                >
                  <option value="">Select a match</option>
                  {matches.map((match) => (
                    <option key={match.user.id} value={match.user.id}>
                      {match.user.firstName} {match.user.lastName}
                    </option>
                  ))}
                </select>
                {matches.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    You need to have accepted matches to schedule sessions
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newSession.scheduledAt}
                  onChange={(e) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSession}
                disabled={!newSession.title || !newSession.teacherId || !newSession.scheduledAt}
              >
                Schedule Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
