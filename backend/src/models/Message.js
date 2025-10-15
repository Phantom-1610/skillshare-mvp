import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Message Information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  
  // Message Content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  readAt: Date,
  
  // Message Thread
  threadId: {
    type: String,
    required: true
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  
  // Moderation
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Deletion
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ isFlagged: 1 });

// Virtual for is read
messageSchema.virtual('isRead').get(function() {
  return this.status === 'read' && this.readAt;
});

// Virtual for is deleted by user
messageSchema.methods.isDeletedBy = function(userId) {
  return this.deletedBy.some(deletion => 
    deletion.user.toString() === userId.toString()
  );
};

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  if (this.status !== 'read') {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  if (this.status === 'sent') {
    this.status = 'delivered';
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to flag message
messageSchema.methods.flagMessage = function(userId, reason) {
  const existingFlag = this.flaggedBy.find(flag => 
    flag.user.toString() === userId.toString()
  );
  
  if (existingFlag) {
    throw new Error('User has already flagged this message');
  }
  
  this.flaggedBy.push({
    user: userId,
    reason: reason,
    flaggedAt: new Date()
  });
  
  // Auto-flag if multiple users flag
  if (this.flaggedBy.length >= 2) {
    this.isFlagged = true;
  }
  
  return this.save();
};

// Method to delete message for user
messageSchema.methods.deleteForUser = function(userId) {
  const existingDeletion = this.deletedBy.find(deletion => 
    deletion.user.toString() === userId.toString()
  );
  
  if (!existingDeletion) {
    this.deletedBy.push({
      user: userId,
      deletedAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to generate thread ID
messageSchema.statics.generateThreadId = function(userId1, userId2) {
  const sortedIds = [userId1, userId2].sort();
  return `thread_${sortedIds[0]}_${sortedIds[1]}`;
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(userId1, userId2, limit = 50, skip = 0) {
  const threadId = this.generateThreadId(userId1, userId2);
  
  return this.find({ threadId })
    .populate('sender', 'firstName lastName profilePicture')
    .populate('recipient', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

// Pre-save middleware to set thread ID
messageSchema.pre('save', function(next) {
  if (!this.threadId) {
    this.threadId = this.constructor.generateThreadId(
      this.sender.toString(),
      this.recipient.toString()
    );
  }
  next();
});

export default mongoose.model('Message', messageSchema);

