import { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Users,
  MessageCircle
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const VideoSessionEmbed = ({ 
  sessionId, 
  roomId, 
  displayName = 'SkillShare User',
  onSessionEnd
}) => {
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi'));
        document.head.appendChild(script);
      });
    };

    const initJitsi = async () => {
      try {
        await loadJitsiScript();
        
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId || `skillshare-${sessionId}`,
          width: '100%',
          height: '600px',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'raisehand',
              'videoquality',
              'filmstrip',
              'tileview',
            ],
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        setJitsiApi(api);
        setIsLoading(false);

        // Event listeners
        api.addEventListener('videoConferenceJoined', () => {
          setIsConnected(true);
          console.log('Joined video conference');
        });

        api.addEventListener('videoConferenceLeft', () => {
          setIsConnected(false);
          if (onSessionEnd) onSessionEnd();
        });

        api.addEventListener('participantJoined', () => {
          setParticipants(prev => prev + 1);
        });

        api.addEventListener('participantLeft', () => {
          setParticipants(prev => Math.max(1, prev - 1));
        });

        api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
          setIsAudioOn(!muted);
        });

        api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
          setIsVideoOn(!muted);
        });

      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
        setIsLoading(false);
      }
    };

    initJitsi();

    // Cleanup
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [sessionId, roomId, displayName]);

  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  };

  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  };

  const endSession = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
    }
    if (onSessionEnd) {
      onSessionEnd();
    }
  };

  return (
    <div className="space-y-4">
      {/* Session Info Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <Badge variant={isConnected ? 'success' : 'warning'}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{participants} participant{participants !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <Card className="p-0 overflow-hidden">
        <div className="relative w-full bg-gray-900">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10" style={{ minHeight: '600px' }}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading video conference...</p>
              </div>
            </div>
          )}
          <div ref={jitsiContainerRef} className="w-full" style={{ minHeight: '600px' }} />
        </div>
      </Card>

      {/* Control Panel */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Session ID: <span className="text-gray-300 font-mono">{sessionId}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isVideoOn ? 'outline' : 'error'}
              size="sm"
              onClick={toggleVideo}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            
            <Button
              variant={isAudioOn ? 'outline' : 'error'}
              size="sm"
              onClick={toggleAudio}
              title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="error"
              size="sm"
              onClick={endSession}
              title="End session"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VideoSessionEmbed;
