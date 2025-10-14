import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import VideoSessionEmbed from '../components/video/VideoSessionEmbed';
import Button from '../components/ui/Button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const VideoSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSessionEnd = () => {
    navigate('/app/sessions');
  };

  // Mock session data
  const session = {
    id: sessionId,
    title: 'JavaScript Fundamentals',
    teacher: 'John Doe',
    student: user?.firstName + ' ' + user?.lastName,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: '60 minutes'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/app/sessions')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Button>
          <h1 className="text-3xl font-bold text-gray-200">{session.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>with {session.teacher}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{session.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Conference */}
      <VideoSessionEmbed
        sessionId={sessionId}
        roomId={`skillshare-${sessionId}`}
        displayName={user?.firstName + ' ' + user?.lastName}
        onSessionEnd={handleSessionEnd}
      />
    </div>
  );
};

export default VideoSessionPage;
