import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Session description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Participants
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  
  // Skills
  skill: {
    type: String,
    required: [true, 'Skill is required'],
    trim: true
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  
  // Scheduling
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [15, 'Minimum session duration is 15 minutes'],
    max: [480, 'Maximum session duration is 8 hours']
  },
  
  // Session Details
  type: {
    type: String,
    enum: ['online', 'in-person'],
    required: [true, 'Session type is required']
  },
  location: {
    type: String,
    required: function() {
      return this.type === 'in-person';
    }
  },
  videoRoomId: {
    type: String,
    required: function() {
      return this.type === 'online';
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  
  // Session Data
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  materials: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'image']
    }
  }],
  
  // Reviews
  teacherReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  studentReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  
  // Timestamps
  startedAt: Date,
  endedAt: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for performance
sessionSchema.index({ teacher: 1, scheduledAt: 1 });
sessionSchema.index({ student: 1, scheduledAt: 1 });
sessionSchema.index({ status: 1, scheduledAt: 1 });
sessionSchema.index({ skill: 1 });
sessionSchema.index({ scheduledAt: 1 });

// Virtual for session duration in hours
sessionSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// Virtual for is upcoming
sessionSchema.virtual('isUpcoming').get(function() {
  return this.scheduledAt > new Date() && this.status === 'scheduled';
});

// Virtual for is past
sessionSchema.virtual('isPast').get(function() {
  return this.scheduledAt < new Date() || this.status === 'completed';
});

// Method to check if session can be cancelled
sessionSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const sessionTime = new Date(this.scheduledAt);
  const hoursUntilSession = (sessionTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' && hoursUntilSession > 2;
};

// Method to start session
sessionSchema.methods.startSession = function() {
  if (this.status !== 'confirmed' && this.status !== 'scheduled') {
    throw new Error('Session cannot be started in current status');
  }
  
  this.status = 'in-progress';
  this.startedAt = new Date();
  return this.save();
};

// Method to end session
sessionSchema.methods.endSession = function() {
  if (this.status !== 'in-progress') {
    throw new Error('Session is not in progress');
  }
  
  this.status = 'completed';
  this.endedAt = new Date();
  return this.save();
};

// Method to cancel session
sessionSchema.methods.cancelSession = function(userId, reason = '') {
  if (!this.canBeCancelled()) {
    throw new Error('Session cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  return this.save();
};

// Pre-save middleware to generate video room ID for online sessions
sessionSchema.pre('save', function(next) {
  if (this.type === 'online' && !this.videoRoomId) {
    // Generate a unique room ID
    this.videoRoomId = `skillshare-${this._id}-${Date.now()}`;
  }
  next();
});

export default mongoose.model('Session', sessionSchema);

