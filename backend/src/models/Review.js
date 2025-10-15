import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Review Information
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'Session is required']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required']
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee is required']
  },
  
  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    maxlength: [1000, 'Review content cannot exceed 1000 characters']
  },
  
  // Review Categories
  categories: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    knowledge: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Review Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'removed'],
    default: 'pending'
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
  
  // Moderation
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  moderationNotes: String,
  
  // Response
  response: {
    content: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
reviewSchema.index({ session: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to ensure one review per session per reviewer
reviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

// Virtual for average category rating
reviewSchema.virtual('averageCategoryRating').get(function() {
  if (!this.categories) return 0;
  
  const categories = Object.values(this.categories).filter(rating => rating);
  if (categories.length === 0) return 0;
  
  return categories.reduce((sum, rating) => sum + rating, 0) / categories.length;
});

// Method to flag review
reviewSchema.methods.flagReview = function(userId, reason) {
  const existingFlag = this.flaggedBy.find(flag => flag.user.toString() === userId.toString());
  
  if (existingFlag) {
    throw new Error('User has already flagged this review');
  }
  
  this.flaggedBy.push({
    user: userId,
    reason: reason,
    flaggedAt: new Date()
  });
  
  // Auto-flag if multiple users flag
  if (this.flaggedBy.length >= 3) {
    this.status = 'flagged';
  }
  
  return this.save();
};

// Method to approve review
reviewSchema.methods.approveReview = function(moderatorId, notes = '') {
  this.status = 'approved';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

// Method to remove review
reviewSchema.methods.removeReview = function(moderatorId, notes = '') {
  this.status = 'removed';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

// Method to add response
reviewSchema.methods.addResponse = function(content) {
  this.response = {
    content: content,
    respondedAt: new Date()
  };
  return this.save();
};

// Pre-save middleware to validate reviewer and reviewee
reviewSchema.pre('save', function(next) {
  // Ensure reviewer and reviewee are different
  if (this.reviewer.toString() === this.reviewee.toString()) {
    return next(new Error('Reviewer and reviewee cannot be the same person'));
  }
  next();
});

export default mongoose.model('Review', reviewSchema);

