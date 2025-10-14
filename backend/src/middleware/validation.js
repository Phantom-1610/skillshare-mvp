import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Validation error',
        details: errorMessage
      });
    }
    
    next();
  };
};

/**
 * Validation schemas
 */
export const schemas = {
  // Auth schemas
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // User schemas
  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    bio: Joi.string().max(500).allow(''),
    location: Joi.string().max(100).allow(''),
    profilePicture: Joi.string().uri().allow('')
  }),

  addSkill: Joi.object({
    skill: Joi.string().trim().min(1).max(50).required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    description: Joi.string().max(200).allow('')
  }),

  updateAvailability: Joi.object({
    timezone: Joi.string().default('UTC'),
    schedule: Joi.array().items(
      Joi.object({
        day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
        timeSlots: Joi.array().items(
          Joi.object({
            start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
          })
        ).min(1).required()
      })
    ).min(1).required()
  }),

  // Session schemas
  createSession: Joi.object({
    title: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().min(1).max(1000).required(),
    skill: Joi.string().trim().min(1).max(50).required(),
    skillLevel: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    scheduledAt: Joi.date().iso().min('now').required(),
    duration: Joi.number().integer().min(15).max(480).required(),
    type: Joi.string().valid('online', 'in-person').required(),
    location: Joi.when('type', {
      is: 'in-person',
      then: Joi.string().min(1).max(200).required(),
      otherwise: Joi.string().allow('')
    })
  }),

  updateSession: Joi.object({
    title: Joi.string().trim().min(1).max(100),
    description: Joi.string().min(1).max(1000),
    scheduledAt: Joi.date().iso().min('now'),
    duration: Joi.number().integer().min(15).max(480),
    location: Joi.string().max(200).allow(''),
    notes: Joi.string().max(2000).allow('')
  }),

  // Review schemas
  createReview: Joi.object({
    sessionId: Joi.string().hex().length(24).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().trim().min(1).max(100).required(),
    content: Joi.string().min(1).max(1000).required(),
    categories: Joi.object({
      communication: Joi.number().integer().min(1).max(5),
      knowledge: Joi.number().integer().min(1).max(5),
      punctuality: Joi.number().integer().min(1).max(5),
      helpfulness: Joi.number().integer().min(1).max(5)
    }).optional()
  }),

  // Message schemas
  sendMessage: Joi.object({
    recipientId: Joi.string().hex().length(24).required(),
    content: Joi.string().min(1).max(2000).required(),
    type: Joi.string().valid('text', 'image', 'file').default('text')
  }),

  // Match schemas
  createMatch: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    skill: Joi.string().trim().min(1).max(50).required(),
    matchType: Joi.string().valid('skill-exchange', 'mentorship').required()
  }),

  // Admin schemas
  updateUserStatus: Joi.object({
    isActive: Joi.boolean().required(),
    reason: Joi.string().max(500).allow('')
  }),

  moderateReview: Joi.object({
    action: Joi.string().valid('approve', 'remove').required(),
    notes: Joi.string().max(500).allow('')
  })
};

/**
 * Query parameter validation
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Query validation error',
        details: errorMessage
      });
    }
    
    next();
  };
};

/**
 * Common query schemas
 */
export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt'),
    search: Joi.string().trim().max(100).allow('')
  }),

  userSearch: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().trim().max(100).allow(''),
    skill: Joi.string().trim().max(50).allow(''),
    location: Joi.string().trim().max(100).allow(''),
    sort: Joi.string().valid('relevance', 'rating', 'newest', 'oldest').default('relevance')
  })
};
