/**
 * Notifications and app polish
 * Handles real-time notifications and error handling
 */

// ============================================================================
// NOTIFICATION MODEL
// ============================================================================

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', index: true },
  type: { 
    type: String, 
    enum: ['message', 'match_request', 'match_accepted', 'session_scheduled', 'session_reminder', 'review_received'],
    required: true 
  },
  title: String,
  message: String,
  data: Object, // Additional data like sender ID, session ID, etc.
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // Create and send notification
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        data
      });

      // Send real-time notification
      this.io.to(`user-${userId}`).emit('new-notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send message notification
  async notifyMessage(recipientId, senderName, messagePreview) {
    return this.createNotification(
      recipientId,
      'message',
      'New Message',
      `${senderName}: ${messagePreview}`,
      { type: 'message' }
    );
  }

  // Send match request notification
  async notifyMatchRequest(recipientId, senderName) {
    return this.createNotification(
      recipientId,
      'match_request',
      'New Match Request',
      `${senderName} wants to connect with you!`,
      { type: 'match_request' }
    );
  }

  // Send match accepted notification
  async notifyMatchAccepted(recipientId, senderName) {
    return this.createNotification(
      recipientId,
      'match_accepted',
      'Match Accepted!',
      `${senderName} accepted your match request`,
      { type: 'match_accepted' }
    );
  }

  // Send session scheduled notification
  async notifySessionScheduled(recipientId, sessionTitle, scheduledAt) {
    return this.createNotification(
      recipientId,
      'session_scheduled',
      'Session Scheduled',
      `Your session "${sessionTitle}" is scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      { type: 'session_scheduled', scheduledAt }
    );
  }

  // Send review received notification
  async notifyReviewReceived(recipientId, reviewerName, rating) {
    return this.createNotification(
      recipientId,
      'review_received',
      'New Review',
      `${reviewerName} gave you a ${rating}-star review!`,
      { type: 'review_received', rating }
    );
  }
}

// ============================================================================
// NOTIFICATION API ROUTES
// ============================================================================

// Get user notifications
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 50, offset = 0 } = req.query;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
app.delete('/api/notifications/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};

// ============================================================================
// FRONTEND NOTIFICATION COMPONENTS
// ============================================================================

// Notification Bell Component
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      
      // Listen for real-time notifications
      socketService.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }
    
    return () => {
      socketService.off('new-notification');
    };
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'match_request':
        return '👋';
      case 'match_accepted':
        return '✅';
      case 'session_scheduled':
        return '📅';
      case 'review_received':
        return '⭐';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    // Mark all as read
                    notifications.forEach(n => !n.read && markAsRead(n.id));
                  }}
                  className="text-sm text-primary-400 hover:text-primary-500"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Toast Notification Component
const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colorClasses = {
    primary: 'text-primary-400',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// INTEGRATION FUNCTIONS
// ============================================================================

// Initialize notification service
const initializeNotificationService = (io) => {
  const notificationService = new NotificationService(io);
  
  // Add notification service to request object
  app.use((req, res, next) => {
    req.notificationService = notificationService;
    next();
  });
  
  return notificationService;
};

// Add error handlers to app
const addErrorHandlers = (app) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};

module.exports = {
  NotificationSchema,
  Notification,
  NotificationService,
  NotificationBell,
  ToastNotification,
  LoadingSpinner,
  ErrorBoundary,
  initializeNotificationService,
  addErrorHandlers,
  errorHandler,
  notFoundHandler
};
