import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Session from '../models/Session.js';

/**
 * Setup Socket.io handlers for real-time features
 */
export const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.firstName} connected: ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining session rooms
    socket.on('join_session', async (sessionId) => {
      try {
        const session = await Session.findById(sessionId)
          .populate('teacher student');

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Check if user is part of the session
        const isParticipant = session.teacher._id.toString() === socket.userId || 
                            session.student._id.toString() === socket.userId;

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this session' });
          return;
        }

        socket.join(`session_${sessionId}`);
        socket.emit('joined_session', { sessionId, session });
        
        // Notify other participant
        socket.to(`session_${sessionId}`).emit('user_joined_session', {
          user: socket.user,
          sessionId
        });

      } catch (error) {
        console.error('Error joining session:', error);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Handle leaving session rooms
    socket.on('leave_session', (sessionId) => {
      socket.leave(`session_${sessionId}`);
      socket.to(`session_${sessionId}`).emit('user_left_session', {
        user: socket.user,
        sessionId
      });
    });

    // Handle private messaging
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, type = 'text' } = data;

        if (!recipientId || !content) {
          socket.emit('error', { message: 'Recipient and content are required' });
          return;
        }

        // Create message
        const message = new Message({
          sender: socket.userId,
          recipient: recipientId,
          content,
          type
        });

        await message.save();
        await message.populate('sender', 'firstName lastName profilePicture');

        // Emit to recipient
        io.to(`user_${recipientId}`).emit('new_message', {
          message,
          threadId: message.threadId
        });

        // Emit back to sender for confirmation
        socket.emit('message_sent', {
          message,
          threadId: message.threadId
        });

        // Mark as delivered
        await message.markAsDelivered();

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message read status
    socket.on('mark_message_read', async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check if user is the recipient
        if (message.recipient.toString() !== socket.userId) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        await message.markAsRead();

        // Notify sender that message was read
        io.to(`user_${message.sender}`).emit('message_read', {
          messageId,
          readAt: message.readAt
        });

      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // Handle session status updates
    socket.on('session_status_update', async (data) => {
      try {
        const { sessionId, status } = data;

        const session = await Session.findById(sessionId);
        
        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Check if user is part of the session
        const isParticipant = session.teacher.toString() === socket.userId || 
                            session.student.toString() === socket.userId;

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        // Update session status
        if (status === 'in-progress') {
          await session.startSession();
        } else if (status === 'completed') {
          await session.endSession();
        }

        // Notify all participants
        io.to(`session_${sessionId}`).emit('session_status_changed', {
          sessionId,
          status: session.status,
          updatedBy: socket.user,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Error updating session status:', error);
        socket.emit('error', { message: 'Failed to update session status' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { threadId } = data;
      socket.to(`thread_${threadId}`).emit('user_typing', {
        userId: socket.userId,
        user: socket.user
      });
    });

    socket.on('typing_stop', (data) => {
      const { threadId } = data;
      socket.to(`thread_${threadId}`).emit('user_stopped_typing', {
        userId: socket.userId
      });
    });

    // Handle online status
    socket.on('update_online_status', (status) => {
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.firstName} disconnected: ${socket.id}`);
      
      // Notify others that user went offline
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Handle server-side events
  io.on('error', (error) => {
    console.error('Socket.io server error:', error);
  });
};

/**
 * Utility functions for socket operations
 */
export const socketUtils = {
  /**
   * Send notification to user
   */
  sendNotificationToUser: (io, userId, notification) => {
    io.to(`user_${userId}`).emit('notification', notification);
  },

  /**
   * Send notification to multiple users
   */
  sendNotificationToUsers: (io, userIds, notification) => {
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit('notification', notification);
    });
  },

  /**
   * Broadcast to session participants
   */
  broadcastToSession: (io, sessionId, event, data) => {
    io.to(`session_${sessionId}`).emit(event, data);
  },

  /**
   * Get online users count
   */
  getOnlineUsersCount: (io) => {
    return io.engine.clientsCount;
  }
};
