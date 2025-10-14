import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMatches: 0,
    upcomingSessions: 0,
    unreadMessages: 0,
    averageRating: 0
  });

  // Fetch real stats from user data
  useEffect(() => {
    setStats({
      totalMatches: user?.followers?.length || 0,
      upcomingSessions: 0, // Will be fetched from API
      unreadMessages: 0, // Will be fetched from API
      averageRating: user?.stats?.averageRating || 0
    });
  }, [user]);

  const quickActions = [
    {
      title: 'Find New Matches',
      description: 'Discover peers to learn from',
      icon: Users,
      action: '/app/explore',
      color: 'primary'
    },
    {
      title: 'Schedule Session',
      description: 'Book a learning session',
      icon: Calendar,
      action: '/app/sessions',
      color: 'secondary'
    },
    {
      title: 'Check Messages',
      description: 'View your conversations',
      icon: MessageCircle,
      action: '/app/chat',
      color: 'accent'
    }
  ];

  // Check profile completion status
  const hasOfferedSkills = user?.offeredSkills?.length > 0;
  const hasDesiredSkills = user?.desiredSkills?.length > 0;
  const hasBio = user?.bio && user.bio.length > 0;
  const hasLocation = user?.location && user.location.length > 0;
  const hasAvailability = user?.availability?.schedule?.length > 0;

  const profileComplete = hasOfferedSkills && hasDesiredSkills && hasBio && hasLocation;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      {/* Stats Cards - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:border-primary-400 transition-colors"
          onClick={() => navigate('/app/matches')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Matches</p>
              <p className="text-2xl font-bold text-gray-200">{stats.totalMatches}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:border-secondary-400 transition-colors"
          onClick={() => navigate('/app/sessions')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-secondary-400/20 rounded-lg">
              <Calendar className="w-6 h-6 text-secondary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-gray-200">{stats.upcomingSessions}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent-400 transition-colors"
          onClick={() => navigate('/app/chat')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-accent-400/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-200">{stats.unreadMessages}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent-400 transition-colors"
          onClick={() => navigate('/app/profile')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-accent-400/20 rounded-lg">
              <Star className="w-6 h-6 text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-gray-200">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Getting Started - MERGED */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Actions & Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Complete Profile */}
          <div
            onClick={() => navigate('/app/profile')}
            className="p-4 border border-gray-700 rounded-lg hover:border-primary-400 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-primary-400/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="font-medium text-gray-200 mb-1">1. Complete Profile</h3>
            <p className="text-sm text-gray-400 mb-3">
              Add skills & bio
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/profile');
              }}
            >
              {profileComplete ? 'View' : 'Start'}
            </Button>
          </div>

          {/* Find Matches */}
          <div
            onClick={() => navigate('/app/explore')}
            className="p-4 border border-gray-700 rounded-lg hover:border-secondary-400 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-secondary-400/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-secondary-400" />
            </div>
            <h3 className="font-medium text-gray-200 mb-1">2. Find Matches</h3>
            <p className="text-sm text-gray-400 mb-3">
              Discover partners
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/explore');
              }}
            >
              Explore
            </Button>
          </div>

          {/* Book Session */}
          <div
            onClick={() => navigate('/app/sessions')}
            className="p-4 border border-gray-700 rounded-lg hover:border-accent-400 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-accent-400/20 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-accent-400" />
            </div>
            <h3 className="font-medium text-gray-200 mb-1">3. Book Session</h3>
            <p className="text-sm text-gray-400 mb-3">
              Schedule learning
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/sessions');
              }}
            >
              Book Now
            </Button>
          </div>

          {/* Check Messages */}
          <div
            onClick={() => navigate('/app/chat')}
            className="p-4 border border-gray-700 rounded-lg hover:border-primary-400 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-primary-400/20 rounded-lg flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="font-medium text-gray-200 mb-1">4. Chat & Connect</h3>
            <p className="text-sm text-gray-400 mb-3">
              Message matches
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/chat');
              }}
            >
              Open Chat
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Progress Card */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Profile Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${hasBio && hasLocation ? 'bg-green-500/20' : 'bg-gray-500/20'} rounded-full flex items-center justify-center`}>
                  {hasBio && hasLocation ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-gray-200">Basic Information</span>
              </div>
              <Badge variant={hasBio && hasLocation ? 'success' : 'warning'}>
                {hasBio && hasLocation ? 'Complete' : 'Incomplete'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${hasOfferedSkills ? 'bg-green-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center`}>
                  {hasOfferedSkills ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <span className="text-gray-200">Skills You Can Teach</span>
              </div>
              <Badge variant={hasOfferedSkills ? 'success' : 'warning'}>
                {hasOfferedSkills ? 'Complete' : 'Add Skills'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${hasDesiredSkills ? 'bg-green-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center`}>
                  {hasDesiredSkills ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <span className="text-gray-200">Skills You Want to Learn</span>
              </div>
              <Badge variant={hasDesiredSkills ? 'success' : 'warning'}>
                {hasDesiredSkills ? 'Complete' : 'Add Skills'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${hasAvailability ? 'bg-green-500/20' : 'bg-gray-500/20'} rounded-full flex items-center justify-center`}>
                  {hasAvailability ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-gray-200">Set Availability</span>
              </div>
              <Badge variant={hasAvailability ? 'success' : 'gray'}>
                {hasAvailability ? 'Complete' : 'Optional'}
              </Badge>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              onClick={() => navigate('/app/profile')}
            >
              {profileComplete ? 'View Profile' : 'Complete Profile'}
            </Button>
          </div>
        </Card>

        {/* Resources Card */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Free Learning Resources</h2>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Access 100% free tutorials, roadmaps, and courses to develop your skills in coding, design, and more.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-700 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary-400">50+</p>
                <p className="text-xs text-gray-400 mt-1">Free Courses</p>
              </div>
              <div className="p-3 border border-gray-700 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary-400">20+</p>
                <p className="text-xs text-gray-400 mt-1">Skill Roadmaps</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Coding & Programming</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Design & Creative Arts</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Business & Marketing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Languages & More</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              onClick={() => navigate('/app/resources')}
            >
              Browse All Resources
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
