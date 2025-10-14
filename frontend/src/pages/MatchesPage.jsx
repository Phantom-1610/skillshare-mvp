import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, MessageCircle, Check, X, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('matches');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchRequests();
  }, []);

  const fetchMatchRequests = async () => {
    try {
      const res = await api.get('/match-requests');
      setReceived(res.data.data.received || []);
      setSent(res.data.data.sent || []);
      setMatches(res.data.data.matches || []);
    } catch (err) {
      console.error('Error fetching match requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/match-requests/${requestId}/accept`);
      toast.success('Match request accepted!');
      fetchMatchRequests();
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/match-requests/${requestId}/reject`);
      toast.success('Match request rejected');
      fetchMatchRequests();
    } catch (err) {
      toast.error('Failed to reject request');
    }
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Matches</h1>
        <p className="text-gray-400">Manage your skill exchange connections</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'matches'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          My Matches ({matches.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'received'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sent'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Sent ({sent.length})
        </button>
      </div>

      {/* My Matches */}
      {activeTab === 'matches' && (
        <div>
          {matches.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No matches yet</h3>
              <p className="text-gray-400 mb-6">
                Send match requests to users you want to connect with
              </p>
              <Link to="/app/explore">
                <Button>Explore Users</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <Card key={match.id} className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                      {match.user.avatar || match.user.profilePicture ? (
                        <img 
                          src={match.user.avatar || match.user.profilePicture} 
                          alt={`${match.user.firstName} ${match.user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${match.user.firstName?.[0]}${match.user.lastName?.[0]}`
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-100">
                          {match.user.firstName} {match.user.lastName}
                        </h3>
                        {match.user.verificationDocs && match.user.verificationDocs.length > 0 && (
                          <Badge variant="success" className="text-xs">
                            <Check className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{match.user.location || 'Location not set'}</p>
                    </div>
                  </div>

                  {match.user.bio && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{match.user.bio}</p>
                  )}

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {match.user.offeredSkills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="primary">
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {match.user.stats && (
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{match.user.stats.averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <div>
                        <span>{match.user.stats.sessionsTaught || 0} sessions</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link to={`/app/profile/${match.user.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/app/chat?userId=${match.user.id}`} className="flex-1">
                      <Button className="w-full text-sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Received Requests */}
      {activeTab === 'received' && (
        <div>
          {received.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No pending requests</h3>
              <p className="text-gray-400">You'll see match requests here when someone wants to connect</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {received.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {request.sender.firstName?.[0]}{request.sender.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-100 text-lg mb-1">
                          {request.sender.firstName} {request.sender.lastName}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{request.sender.location || 'Location not set'}</p>
                        {request.message && (
                          <p className="text-sm text-gray-300 mb-3 italic">"{request.message}"</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {request.sender.offeredSkills?.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="primary" className="text-xs">
                              {skill.skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Requested {new Date(request.createdAt).toLocaleDateString('en-LK', {
                            timeZone: 'Asia/Colombo',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === 'sent' && (
        <div>
          {sent.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No pending requests</h3>
              <p className="text-gray-400 mb-6">
                Send match requests to users you want to connect with
              </p>
              <Link to="/app/explore">
                <Button>Explore Users</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sent.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {request.receiver.firstName?.[0]}{request.receiver.lastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-100">
                        {request.receiver.firstName} {request.receiver.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">{request.receiver.location || 'Location not set'}</p>
                    </div>
                  </div>

                  {request.message && (
                    <p className="text-sm text-gray-300 mb-3 italic">"{request.message}"</p>
                  )}

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {request.receiver.offeredSkills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-yellow-500">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Sent {new Date(request.createdAt).toLocaleDateString('en-LK', {
                      timeZone: 'Asia/Colombo',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
