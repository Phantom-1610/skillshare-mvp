import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  // Match Participants
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User1 is required']
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User2 is required']
  },
  
  // Match Details
  skill: {
    type: String,
    required: [true, 'Skill is required'],
    trim: true
  },
  matchType: {
    type: String,
    enum: ['skill-exchange', 'mentorship'],
    required: true
  },
  
  // Match Score and Reasons
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  reasons: [{
    type: String,
    enum: [
      'skill_match',
      'level_compatibility',
      'location_proximity',
      'availability_overlap',
      'mutual_skills',
      'high_rating',
      'active_user'
    ]
  }],
  
  // Match Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  
  // Match Actions
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: Date,
  
  // Match Expiry
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  },
  
  // Match History
  sessionsCreated: {
    type: Number,
    default: 0
  },
  lastSessionAt: Date,
  
  // Match Preferences
  preferences: {
    preferredTime: String,
    preferredDuration: Number,
    sessionType: {
      type: String,
      enum: ['online', 'in-person', 'both'],
      default: 'both'
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
matchSchema.index({ user1: 1, user2: 1 });
matchSchema.index({ user1: 1, status: 1 });
matchSchema.index({ user2: 1, status: 1 });
matchSchema.index({ skill: 1, status: 1 });
matchSchema.index({ score: -1 });
matchSchema.index({ expiresAt: 1 });
matchSchema.index({ createdAt: -1 });

// Compound index to ensure unique matches
matchSchema.index({ user1: 1, user2: 1, skill: 1 }, { unique: true });

// Virtual for is expired
matchSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual for days until expiry
matchSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const diffTime = this.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to accept match
matchSchema.methods.acceptMatch = function(userId) {
  if (this.status !== 'pending') {
    throw new Error('Match is not pending');
  }
  
  if (this.isExpired) {
    throw new Error('Match has expired');
  }
  
  // Ensure the user is not the one who initiated
  if (this.initiatedBy.toString() === userId.toString()) {
    throw new Error('Cannot accept your own match request');
  }
  
  // Ensure the user is part of the match
  if (this.user1.toString() !== userId.toString() && this.user2.toString() !== userId.toString()) {
    throw new Error('User is not part of this match');
  }
  
  this.status = 'accepted';
  this.respondedBy = userId;
  this.respondedAt = new Date();
  return this.save();
};

// Method to decline match
matchSchema.methods.declineMatch = function(userId) {
  if (this.status !== 'pending') {
    throw new Error('Match is not pending');
  }
  
  // Ensure the user is not the one who initiated
  if (this.initiatedBy.toString() === userId.toString()) {
    throw new Error('Cannot decline your own match request');
  }
  
  // Ensure the user is part of the match
  if (this.user1.toString() !== userId.toString() && this.user2.toString() !== userId.toString()) {
    throw new Error('User is not part of this match');
  }
  
  this.status = 'declined';
  this.respondedBy = userId;
  this.respondedAt = new Date();
  return this.save();
};

// Method to expire match
matchSchema.methods.expireMatch = function() {
  if (this.status === 'pending' && this.isExpired) {
    this.status = 'expired';
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to increment session count
matchSchema.methods.incrementSessionCount = function() {
  this.sessionsCreated += 1;
  this.lastSessionAt = new Date();
  return this.save();
};

// Static method to find matches for user
matchSchema.statics.findMatchesForUser = function(userId, status = 'accepted') {
  return this.find({
    $or: [
      { user1: userId },
      { user2: userId }
    ],
    status: status
  })
  .populate('user1', 'firstName lastName profilePicture location')
  .populate('user2', 'firstName lastName profilePicture location')
  .populate('initiatedBy', 'firstName lastName')
  .sort({ score: -1, createdAt: -1 });
};

// Static method to find pending matches for user
matchSchema.statics.findPendingMatchesForUser = function(userId) {
  return this.find({
    $or: [
      { user1: userId },
      { user2: userId }
    ],
    status: 'pending',
    expiresAt: { $gt: new Date() }
  })
  .populate('user1', 'firstName lastName profilePicture location')
  .populate('user2', 'firstName lastName profilePicture location')
  .populate('initiatedBy', 'firstName lastName')
  .sort({ score: -1, createdAt: -1 });
};

// Static method to check if users are matched
matchSchema.statics.areMatched = function(userId1, userId2, skill = null) {
  const query = {
    $or: [
      { user1: userId1, user2: userId2 },
      { user1: userId2, user2: userId1 }
    ],
    status: 'accepted'
  };
  
  if (skill) {
    query.skill = skill;
  }
  
  return this.findOne(query);
};

// Pre-save middleware to ensure user1 < user2 for consistency
matchSchema.pre('save', function(next) {
  if (this.user1.toString() > this.user2.toString()) {
    // Swap users to maintain consistency
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

export default mongoose.model('Match', matchSchema);

