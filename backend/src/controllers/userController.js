import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all users with search and filtering
 * @route   GET /api/users
 * @access  Public
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, skill, location, sort = 'relevance' } = req.query;
  
  const query = { isActive: true, isVerified: true };
  
  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by skill
  if (skill) {
    query['offeredSkills.skill'] = { $regex: skill, $options: 'i' };
  }
  
  // Filter by location
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  
  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'rating':
      sortObj = { 'stats.averageRating': -1, 'stats.totalRatings': -1 };
      break;
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    default: // relevance
      sortObj = { 'stats.averageRating': -1, createdAt: -1 };
  }
  
  const users = await User.find(query)
    .select('-password -emailVerificationToken -passwordResetToken')
    .sort(sortObj)
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await User.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:userId
 * @access  Public
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('-password -emailVerificationToken -passwordResetToken');
  
  if (!user || !user.isActive) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, bio, location, profilePicture } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Add skill to user
 * @route   POST /api/users/skills
 * @access  Private
 */
export const addSkill = asyncHandler(async (req, res) => {
  const { skill, level, description, type = 'offered' } = req.body;
  
  const user = await User.findById(req.user._id);
  
  const skillData = { skill, level, description };
  
  if (type === 'offered') {
    // Check if skill already exists
    const existingSkill = user.offeredSkills.find(s => s.skill.toLowerCase() === skill.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({
        error: 'Skill already exists',
        code: 'SKILL_EXISTS'
      });
    }
    user.offeredSkills.push(skillData);
  } else {
    // Check if skill already exists
    const existingSkill = user.desiredSkills.find(s => s.skill.toLowerCase() === skill.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({
        error: 'Skill already exists',
        code: 'SKILL_EXISTS'
      });
    }
    user.desiredSkills.push(skillData);
  }
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Skill added successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Remove skill from user
 * @route   DELETE /api/users/skills/:skillId
 * @access  Private
 */
export const removeSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const { type = 'offered' } = req.query;
  
  const user = await User.findById(req.user._id);
  
  if (type === 'offered') {
    user.offeredSkills = user.offeredSkills.filter(skill => skill._id.toString() !== skillId);
  } else {
    user.desiredSkills = user.desiredSkills.filter(skill => skill._id.toString() !== skillId);
  }
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Skill removed successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Update user availability
 * @route   PUT /api/users/availability
 * @access  Private
 */
export const updateAvailability = asyncHandler(async (req, res) => {
  const { timezone, schedule } = req.body;
  
  const user = await User.findById(req.user._id);
  
  user.availability = { timezone, schedule };
  await user.save();
  
  res.json({
    success: true,
    message: 'Availability updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Follow user
 * @route   POST /api/users/:userId/follow
 * @access  Private
 */
export const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  if (userId === req.user._id.toString()) {
    return res.status(400).json({
      error: 'Cannot follow yourself',
      code: 'CANNOT_FOLLOW_SELF'
    });
  }
  
  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const currentUser = await User.findById(req.user._id);
  
  // Check if already following
  if (currentUser.following.includes(userId)) {
    return res.status(400).json({
      error: 'Already following this user',
      code: 'ALREADY_FOLLOWING'
    });
  }
  
  // Add to following and followers
  currentUser.following.push(userId);
  userToFollow.followers.push(req.user._id);
  
  await Promise.all([currentUser.save(), userToFollow.save()]);
  
  res.json({
    success: true,
    message: 'User followed successfully'
  });
});

/**
 * @desc    Unfollow user
 * @route   DELETE /api/users/:userId/follow
 * @access  Private
 */
export const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const userToUnfollow = await User.findById(userId);
  if (!userToUnfollow) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const currentUser = await User.findById(req.user._id);
  
  // Remove from following and followers
  currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
  userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
  
  await Promise.all([currentUser.save(), userToUnfollow.save()]);
  
  res.json({
    success: true,
    message: 'User unfollowed successfully'
  });
});

/**
 * @desc    Get user followers
 * @route   GET /api/users/:userId/followers
 * @access  Public
 */
export const getFollowers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const user = await User.findById(req.params.userId)
    .populate({
      path: 'followers',
      select: 'firstName lastName profilePicture location stats',
      options: {
        limit: limit * 1,
        skip: (page - 1) * limit
      }
    });
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const total = user.followers.length;
  
  res.json({
    success: true,
    data: {
      followers: user.followers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get user following
 * @route   GET /api/users/:userId/following
 * @access  Public
 */
export const getFollowing = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const user = await User.findById(req.params.userId)
    .populate({
      path: 'following',
      select: 'firstName lastName profilePicture location stats',
      options: {
        limit: limit * 1,
        skip: (page - 1) * limit
      }
    });
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const total = user.following.length;
  
  res.json({
    success: true,
    data: {
      following: user.following,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get user stats
 * @route   GET /api/users/:userId/stats
 * @access  Public
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('stats followers following offeredSkills desiredSkills');
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const stats = {
    ...user.stats.toObject(),
    followerCount: user.followers.length,
    followingCount: user.following.length,
    offeredSkillsCount: user.offeredSkills.length,
    desiredSkillsCount: user.desiredSkills.length
  };
  
  res.json({
    success: true,
    data: { stats }
  });
});



