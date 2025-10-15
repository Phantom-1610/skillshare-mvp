/**
 * Real-time chat system
 * Handles messaging between users with live updates
 */

// ============================================================================
// SOCKET.IO SETUP
// ============================================================================

const { Server } = require('socket.io');
const http = require('http');

// Create Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle new message
  socket.on('send-message', async (messageData) => {
    try {
      // Save message to database
      const message = await Message.create({
        threadId: messageData.threadId,
        sender: messageData.sender,
        recipient: messageData.recipient,
        content: messageData.content,
        type: messageData.type || 'text',
        status: 'sent'
      });
      
      // Emit to recipient
      socket.to(`user-${messageData.recipient}`).emit('new-message', {
        id: message._id,
        threadId: message.threadId,
        sender: message.sender,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt
      });
      
      // Emit back to sender for confirmation
      socket.emit('message-sent', {
        id: message._id,
        status: 'sent'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(`user-${data.recipient}`).emit('user-typing', {
      sender: data.sender,
      isTyping: true
    });
  });
  
  socket.on('typing-stop', (data) => {
    socket.to(`user-${data.recipient}`).emit('user-typing', {
      sender: data.sender,
      isTyping: false
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ============================================================================
// MESSAGE MODEL
// ============================================================================

const MessageSchema = new mongoose.Schema({
  threadId: { type: String, index: true },
  sender: { type: String, index: true },
  recipient: { type: String, index: true },
  content: String,
  type: { type: String, default: 'text' },
  status: { type: String, default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// ============================================================================
// MESSAGE API ROUTES
// ============================================================================

// Get all conversations for a user
app.get('/api/messages', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    }).sort({ createdAt: -1 });
    
    // Group messages by conversation partner
    const conversations = new Map();
    
    messages.forEach(message => {
      const partnerId = message.sender === userId ? message.recipient : message.sender;
      
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partnerId,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      // Count unread messages
      if (message.recipient === userId && message.status !== 'read') {
        conversations.get(partnerId).unreadCount++;
      }
    });
    
    res.json({
      success: true,
      data: Array.from(conversations.values())
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages in a specific conversation
app.get('/api/messages/:partnerId', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const partnerId = req.params.partnerId;
    
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: partnerId },
        { sender: partnerId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: partnerId, recipient: userId, status: 'sent' },
      { status: 'read' }
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a new message
app.post('/api/messages', auth, async (req, res) => {
  try {
    const { recipient, content, type = 'text' } = req.body;
    const sender = req.userId;
    
    // Create thread ID (consistent ordering)
    const threadId = [sender, recipient].sort().join('-');
    
    const message = await Message.create({
      threadId,
      sender,
      recipient,
      content,
      type,
      status: 'sent'
    });
    
    // Emit real-time message
    io.emit('new-message', {
      id: message._id,
      threadId: message.threadId,
      sender: message.sender,
      recipient: message.recipient,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt
    });
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// FRONTEND CHAT COMPONENTS
// ============================================================================

// Chat Page Component
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const { user } = useAuthStore();

  useEffect(() => {
    fetchConversations();
    
    // Connect to socket
    if (user?.id) {
      socketService.connect(user.id);
      
      socketService.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });
      
      socketService.on('user-typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => new Set([...prev, data.sender]));
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.sender);
            return newSet;
          });
        }
      });
    }
    
    return () => {
      socketService.off('new-message');
      socketService.off('user-typing');
    };
  }, [user?.id]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const response = await api.get(`/messages/${partnerId}`);
      setMessages(response.data.data);
      setActiveConversation(partnerId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      await api.post('/messages', {
        recipient: activeConversation,
        content: newMessage,
        type: 'text'
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (isTyping) => {
    if (isTyping) {
      socketService.emit('typing-start', { recipient: activeConversation });
      setIsTyping(true);
    } else {
      socketService.emit('typing-stop', { recipient: activeConversation });
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.partnerId}
              onClick={() => fetchMessages(conversation.partnerId)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversation === conversation.partnerId ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                  {conversation.partnerName?.charAt(0) || 'U'}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-medium">{conversation.partnerName || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.content}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <h3 className="font-semibold">Chat with User</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === user?.id
                        ? 'bg-primary-400 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                    Someone is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                  onFocus={() => handleTyping(true)}
                  onBlur={() => handleTyping(false)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary-400 text-white px-6 py-2 rounded-lg hover:bg-primary-500"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Socket Service
class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io('http://localhost:5000', {
      query: { userId }
    });
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();

module.exports = {
  MessageSchema,
  Message,
  ChatPage,
  socketService,
  io
};
