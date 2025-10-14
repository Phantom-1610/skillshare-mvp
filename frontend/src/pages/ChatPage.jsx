import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Users, Search, Video } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/auth';
import { socketService } from '../services/socketService';
import api from '../services/api';

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // NO HARDCODED DATA - Fetch real conversations from API
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.user.id);
    }
  }, [activeConversation]);

  // Handle userId parameter for direct messaging
  useEffect(() => {
    if (userId) {
      // Always fetch fresh conversations when userId changes
      fetchConversations().then(() => {
        // After fetching, try to find the conversation
        const conversation = conversations.find(c => c.user.id === userId);
        if (conversation) {
          setActiveConversation(conversation);
        } else {
          // Create new conversation for this user
          fetchUserAndCreateConversation(userId);
        }
      });
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages');
      const convos = response.data.data?.conversations || [];
      setConversations(convos);
      
      // If userId is specified, find and set that conversation
      if (userId && convos.length > 0) {
        const targetConvo = convos.find(c => c.user.id === userId || c.user._id === userId);
        if (targetConvo) {
          setActiveConversation(targetConvo);
        }
      } else if (!userId && convos.length > 0) {
        // Set first conversation as active if no userId specified
        setActiveConversation(convos[0]);
      }
      
      return convos;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]); // EMPTY if error - NO hardcoded data!
      return [];
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/${otherUserId}`);
      setMessages(response.data.data?.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // EMPTY if error
    }
  };

  const fetchUserAndCreateConversation = async (uid) => {
    try {
      const response = await api.get(`/users/${uid}`);
      const otherUser = response.data.data?.user;
      if (otherUser) {
        const newConvo = {
          id: uid,
          user: otherUser,
          lastMessage: null,
          unreadCount: 0
        };
        setConversations(prev => [newConvo, ...prev]);
        setActiveConversation(newConvo);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Socket.io for real-time messaging
  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);
      
      socketService.on('new-message', (data) => {
        setMessages(prev => [...prev, data]);
        fetchConversations();
      });

      return () => {
        socketService.off('new-message');
      };
    }
  }, [user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (newMessage.trim() && activeConversation) {
      const messageData = {
        recipientId: activeConversation.user.id,
        content: newMessage.trim(),
        type: 'text'
      };

      // Optimistically add message to UI
      const optimisticMessage = {
        id: Date.now().toString(),
        sender: user.id,
        recipient: activeConversation.user.id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        status: 'sending'
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      try {
        await api.post('/messages', messageData);
        fetchConversations();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex h-[calc(100vh-12rem)] bg-dark-900">
      {/* Conversations List */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Messages</h2>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-800 transition-colors ${
                  activeConversation?.id === conv.id ? 'bg-gray-800 border-l-4 border-primary-400' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {conv.user.firstName?.charAt(0)}{conv.user.lastName?.charAt(0)}
                    </span>
                  </div>
                  {conv.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {conv.user.firstName} {conv.user.lastName}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                
                {conv.unreadCount > 0 && (
                  <Badge variant="error" size="sm">
                    {conv.unreadCount}
                  </Badge>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">No conversations yet</p>
              <p className="text-gray-500 text-xs">
                Start messaging from the Matches page!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {activeConversation.user.firstName?.charAt(0)}{activeConversation.user.lastName?.charAt(0)}
                    </span>
                  </div>
                  {activeConversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">
                    {activeConversation.user.firstName} {activeConversation.user.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeConversation.user.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/app/video/call-${Date.now()}`)}
                  title="Start Video Call"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Video Call
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                const isOwnMessage = message.sender?.id === user.id || message.sender === user.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-primary-400 text-white'
                            : 'bg-gray-800 text-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp || message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Send className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No messages yet</p>
                  <p className="text-gray-500 text-xs mt-1">Send a message to start the conversation!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Select a conversation</h3>
            <p className="text-gray-500 text-sm">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
