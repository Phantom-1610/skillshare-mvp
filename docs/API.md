# SkillShare API Documentation

## Overview

The SkillShare API is a RESTful API built with Node.js and Express.js that provides endpoints for user management, skill matching, session booking, real-time communication, and administrative functions.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.skillshare.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "bio": "Software developer",
      "location": "New York, NY",
      "offeredSkills": [
        {
          "_id": "64a1b2c3d4e5f6789012346",
          "skill": "JavaScript",
          "level": "advanced",
          "description": "5+ years of experience"
        }
      ],
      "desiredSkills": [
        {
          "_id": "64a1b2c3d4e5f6789012347",
          "skill": "Python",
          "level": "intermediate",
          "priority": "high"
        }
      ],
      "stats": {
        "sessionsTaught": 10,
        "sessionsAttended": 5,
        "averageRating": 4.8,
        "totalRatings": 15
      }
    }
  }
}
```

### Update Password
```http
PUT /auth/update-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

## User Endpoints

### Get Users
```http
GET /users?page=1&limit=10&search=john&skill=javascript&location=new york&sort=relevance
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search by name or email
- `skill` (string): Filter by skill
- `location` (string): Filter by location
- `sort` (string): Sort by relevance, rating, newest, oldest

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64a1b2c3d4e5f6789012345",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://example.com/avatar.jpg",
        "location": "New York, NY",
        "offeredSkills": ["JavaScript", "React"],
        "stats": {
          "averageRating": 4.8,
          "totalRatings": 15
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Get User Profile
```http
GET /users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Software developer with 5+ years of experience",
      "location": "New York, NY",
      "profilePicture": "https://example.com/avatar.jpg",
      "offeredSkills": [
        {
          "_id": "64a1b2c3d4e5f6789012346",
          "skill": "JavaScript",
          "level": "advanced",
          "description": "5+ years of experience with modern JS"
        }
      ],
      "desiredSkills": [
        {
          "_id": "64a1b2c3d4e5f6789012347",
          "skill": "Python",
          "level": "intermediate",
          "priority": "high"
        }
      ],
      "availability": {
        "timezone": "America/New_York",
        "schedule": [
          {
            "day": "monday",
            "timeSlots": [
              {
                "start": "09:00",
                "end": "12:00"
              }
            ]
          }
        ]
      },
      "stats": {
        "sessionsTaught": 10,
        "sessionsAttended": 5,
        "averageRating": 4.8,
        "totalRatings": 15
      },
      "followerCount": 25,
      "followingCount": 15
    }
  }
}
```

### Update Profile
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "location": "San Francisco, CA",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

### Add Skill
```http
POST /users/skills
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "skill": "Python",
  "level": "intermediate",
  "description": "2 years of experience",
  "type": "offered"
}
```

### Remove Skill
```http
DELETE /users/skills/:skillId?type=offered
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (string): "offered" or "desired" (default: "offered")

### Update Availability
```http
PUT /users/availability
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "timezone": "America/New_York",
  "schedule": [
    {
      "day": "monday",
      "timeSlots": [
        {
          "start": "09:00",
          "end": "12:00"
        },
        {
          "start": "14:00",
          "end": "17:00"
        }
      ]
    },
    {
      "day": "tuesday",
      "timeSlots": [
        {
          "start": "10:00",
          "end": "15:00"
        }
      ]
    }
  ]
}
```

### Follow User
```http
POST /users/:userId/follow
```

**Headers:**
```
Authorization: Bearer <token>
```

### Unfollow User
```http
DELETE /users/:userId/follow
```

**Headers:**
```
Authorization: Bearer <token>
```

## Session Endpoints

### Get Sessions
```http
GET /sessions?page=1&limit=10&status=scheduled
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (scheduled, confirmed, in-progress, completed, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "_id": "64a1b2c3d4e5f6789012348",
        "title": "JavaScript Fundamentals",
        "description": "Learn the basics of JavaScript programming",
        "teacher": {
          "_id": "64a1b2c3d4e5f6789012345",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "https://example.com/avatar.jpg"
        },
        "student": {
          "_id": "64a1b2c3d4e5f6789012349",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePicture": "https://example.com/avatar2.jpg"
        },
        "skill": "JavaScript",
        "skillLevel": "beginner",
        "scheduledAt": "2024-01-15T14:00:00.000Z",
        "duration": 60,
        "type": "online",
        "videoRoomId": "skillshare-64a1b2c3d4e5f6789012348-1705315200000",
        "status": "scheduled",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Get Session Details
```http
GET /sessions/:sessionId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "_id": "64a1b2c3d4e5f6789012348",
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript programming",
      "teacher": {
        "_id": "64a1b2c3d4e5f6789012345",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://example.com/avatar.jpg"
      },
      "student": {
        "_id": "64a1b2c3d4e5f6789012349",
        "firstName": "Jane",
        "lastName": "Smith",
        "profilePicture": "https://example.com/avatar2.jpg"
      },
      "skill": "JavaScript",
      "skillLevel": "beginner",
      "scheduledAt": "2024-01-15T14:00:00.000Z",
      "duration": 60,
      "type": "online",
      "location": null,
      "videoRoomId": "skillshare-64a1b2c3d4e5f6789012348-1705315200000",
      "status": "scheduled",
      "notes": null,
      "materials": [],
      "startedAt": null,
      "endedAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Create Session
```http
POST /sessions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "skill": "JavaScript",
  "skillLevel": "beginner",
  "scheduledAt": "2024-01-15T14:00:00.000Z",
  "duration": 60,
  "type": "online",
  "location": null
}
```

### Update Session
```http
PUT /sessions/:sessionId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Session Title",
  "description": "Updated description",
  "scheduledAt": "2024-01-16T14:00:00.000Z",
  "duration": 90,
  "notes": "Bring your laptop and notebook"
}
```

### Cancel Session
```http
POST /sessions/:sessionId/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

### Start Session
```http
POST /sessions/:sessionId/start
```

**Headers:**
```
Authorization: Bearer <token>
```

### End Session
```http
POST /sessions/:sessionId/end
```

**Headers:**
```
Authorization: Bearer <token>
```

## Match Endpoints

### Get Matches
```http
GET /matches?page=1&limit=10&status=accepted
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending, accepted, declined, expired)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "_id": "64a1b2c3d4e5f6789012350",
        "user1": {
          "_id": "64a1b2c3d4e5f6789012345",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "https://example.com/avatar.jpg",
          "location": "New York, NY"
        },
        "user2": {
          "_id": "64a1b2c3d4e5f6789012349",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePicture": "https://example.com/avatar2.jpg",
          "location": "San Francisco, CA"
        },
        "skill": "JavaScript",
        "matchType": "skill-exchange",
        "score": 85,
        "reasons": ["skill_match", "level_compatibility", "availability_overlap"],
        "status": "accepted",
        "initiatedBy": {
          "_id": "64a1b2c3d4e5f6789012345",
          "firstName": "John",
          "lastName": "Doe"
        },
        "respondedBy": {
          "_id": "64a1b2c3d4e5f6789012349",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "respondedAt": "2024-01-02T10:00:00.000Z",
        "expiresAt": "2024-01-08T10:00:00.000Z",
        "sessionsCreated": 2,
        "lastSessionAt": "2024-01-05T14:00:00.000Z",
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

### Get Match Details
```http
GET /matches/:matchId
```

**Headers:**
```
Authorization: Bearer <token>
```

### Create Match
```http
POST /matches
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "64a1b2c3d4e5f6789012349",
  "skill": "JavaScript",
  "matchType": "skill-exchange"
}
```

### Accept Match
```http
POST /matches/:matchId/accept
```

**Headers:**
```
Authorization: Bearer <token>
```

### Decline Match
```http
POST /matches/:matchId/decline
```

**Headers:**
```
Authorization: Bearer <token>
```

## Review Endpoints

### Get Reviews
```http
GET /reviews?page=1&limit=10&userId=64a1b2c3d4e5f6789012345
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `userId` (string): Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64a1b2c3d4e5f6789012351",
        "session": {
          "_id": "64a1b2c3d4e5f6789012348",
          "title": "JavaScript Fundamentals"
        },
        "reviewer": {
          "_id": "64a1b2c3d4e5f6789012349",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePicture": "https://example.com/avatar2.jpg"
        },
        "reviewee": {
          "_id": "64a1b2c3d4e5f6789012345",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "title": "Excellent teacher!",
        "content": "John was very patient and explained everything clearly. Highly recommend!",
        "categories": {
          "communication": 5,
          "knowledge": 5,
          "punctuality": 5,
          "helpfulness": 5
        },
        "status": "approved",
        "createdAt": "2024-01-10T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

### Create Review
```http
POST /reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "64a1b2c3d4e5f6789012348",
  "rating": 5,
  "title": "Excellent teacher!",
  "content": "John was very patient and explained everything clearly. Highly recommend!",
  "categories": {
    "communication": 5,
    "knowledge": 5,
    "punctuality": 5,
    "helpfulness": 5
  }
}
```

### Flag Review
```http
POST /reviews/:reviewId/flag
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

## Admin Endpoints

### Get Admin Dashboard
```http
GET /admin/dashboard
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "activeUsers": 890,
      "totalSessions": 3450,
      "completedSessions": 3200,
      "averageRating": 4.6,
      "totalReviews": 2800
    },
    "recentActivity": [
      {
        "type": "user_registration",
        "message": "New user registered: jane.smith@example.com",
        "timestamp": "2024-01-10T10:00:00.000Z"
      },
      {
        "type": "session_completed",
        "message": "Session completed: JavaScript Fundamentals",
        "timestamp": "2024-01-10T09:30:00.000Z"
      }
    ]
  }
}
```

### Get All Users
```http
GET /admin/users?page=1&limit=20&search=john&role=user&isActive=true
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Update User Status
```http
PUT /admin/users/:userId/status
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Violation of community guidelines"
}
```

### Moderate Review
```http
POST /admin/reviews/:reviewId/moderate
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "action": "approve",
  "notes": "Review approved after manual review"
}
```

## WebSocket Events

### Connection
```javascript
// Connect to Socket.io server
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client to Server Events

#### Join Session
```javascript
socket.emit('join_session', sessionId);
```

#### Send Message
```javascript
socket.emit('send_message', {
  recipientId: '64a1b2c3d4e5f6789012349',
  content: 'Hello!',
  type: 'text'
});
```

#### Mark Message as Read
```javascript
socket.emit('mark_message_read', messageId);
```

#### Update Session Status
```javascript
socket.emit('session_status_update', {
  sessionId: '64a1b2c3d4e5f6789012348',
  status: 'in-progress'
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('typing_start', { threadId: 'thread_123_456' });

// Stop typing
socket.emit('typing_stop', { threadId: 'thread_123_456' });
```

### Server to Client Events

#### New Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  console.log('Thread ID:', data.threadId);
});
```

#### Message Sent Confirmation
```javascript
socket.on('message_sent', (data) => {
  console.log('Message sent:', data.message);
});
```

#### Message Read Confirmation
```javascript
socket.on('message_read', (data) => {
  console.log('Message read:', data.messageId);
  console.log('Read at:', data.readAt);
});
```

#### Session Events
```javascript
// Joined session
socket.on('joined_session', (data) => {
  console.log('Joined session:', data.sessionId);
  console.log('Session data:', data.session);
});

// User joined session
socket.on('user_joined_session', (data) => {
  console.log('User joined:', data.user);
  console.log('Session ID:', data.sessionId);
});

// Session status changed
socket.on('session_status_changed', (data) => {
  console.log('Session status:', data.status);
  console.log('Updated by:', data.updatedBy);
});
```

#### Typing Events
```javascript
// User is typing
socket.on('user_typing', (data) => {
  console.log('User typing:', data.user);
});

// User stopped typing
socket.on('user_stopped_typing', (data) => {
  console.log('User stopped typing:', data.userId);
});
```

#### Notifications
```javascript
socket.on('notification', (notification) => {
  console.log('Notification:', notification);
});
```

#### User Status
```javascript
socket.on('user_status_changed', (data) => {
  console.log('User status:', data.userId, data.status);
});
```

## Error Codes

### Authentication Errors
- `NO_TOKEN`: No authentication token provided
- `INVALID_TOKEN`: Invalid or malformed token
- `TOKEN_EXPIRED`: Token has expired
- `ACCOUNT_DEACTIVATED`: User account is deactivated
- `INVALID_CREDENTIALS`: Invalid email or password
- `USER_EXISTS`: User already exists with this email

### Validation Errors
- `VALIDATION_ERROR`: Request data validation failed
- `MISSING_FIELD`: Required field is missing
- `INVALID_FORMAT`: Field format is invalid
- `INVALID_LENGTH`: Field length is invalid

### Resource Errors
- `USER_NOT_FOUND`: User not found
- `SESSION_NOT_FOUND`: Session not found
- `MATCH_NOT_FOUND`: Match not found
- `REVIEW_NOT_FOUND`: Review not found
- `RESOURCE_NOT_FOUND`: General resource not found

### Permission Errors
- `ACCESS_DENIED`: Insufficient permissions
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `NOT_OWNER`: User is not the owner of the resource
- `ADMIN_REQUIRED`: Admin role required

### Business Logic Errors
- `MATCH_ALREADY_EXISTS`: Match already exists between users
- `SESSION_CANNOT_BE_CANCELLED`: Session cannot be cancelled
- `SESSION_ALREADY_STARTED`: Session has already started
- `SESSION_ALREADY_ENDED`: Session has already ended
- `REVIEW_ALREADY_EXISTS`: Review already exists for this session

### System Errors
- `INTERNAL_SERVER_ERROR`: Internal server error
- `DATABASE_ERROR`: Database operation failed
- `EXTERNAL_SERVICE_ERROR`: External service unavailable
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 10 requests per 15 minutes per IP
- **File Upload**: 20 requests per hour per user
- **WebSocket**: No rate limiting (handled by connection limits)

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Filtering and Sorting

### Common Query Parameters
- `search` (string): Search term
- `sort` (string): Sort field and direction (e.g., "createdAt", "-rating")
- `filter` (object): Filter criteria

### User Filtering
- `skill` (string): Filter by skill
- `location` (string): Filter by location
- `level` (string): Filter by skill level
- `rating` (number): Minimum rating

### Session Filtering
- `status` (string): Filter by status
- `type` (string): Filter by type (online/in-person)
- `skill` (string): Filter by skill
- `dateFrom` (string): Filter by date range
- `dateTo` (string): Filter by date range

## File Upload

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX
- **Videos**: MP4, WebM, MOV

### File Size Limits
- **Images**: 5MB maximum
- **Documents**: 10MB maximum
- **Videos**: 100MB maximum

### Upload Endpoint
```http
POST /upload
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
type: "profile-picture" | "session-material" | "document"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "file.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

## Webhooks

### Supported Events
- `user.registered`: New user registration
- `user.verified`: User email verified
- `session.created`: New session created
- `session.completed`: Session completed
- `review.created`: New review created
- `match.created`: New match created

### Webhook Payload
```json
{
  "event": "user.registered",
  "timestamp": "2024-01-10T10:00:00.000Z",
  "data": {
    "userId": "64a1b2c3d4e5f6789012345",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install skillshare-api-client
```

```javascript
import { SkillShareAPI } from 'skillshare-api-client';

const api = new SkillShareAPI({
  baseURL: 'https://api.skillshare.com/api',
  token: 'your-jwt-token'
});

// Get users
const users = await api.users.list({ page: 1, limit: 10 });

// Create session
const session = await api.sessions.create({
  title: 'JavaScript Fundamentals',
  description: 'Learn the basics',
  skill: 'JavaScript',
  skillLevel: 'beginner',
  scheduledAt: '2024-01-15T14:00:00.000Z',
  duration: 60,
  type: 'online'
});
```

### Python
```bash
pip install skillshare-api-python
```

```python
from skillshare_api import SkillShareAPI

api = SkillShareAPI(
    base_url='https://api.skillshare.com/api',
    token='your-jwt-token'
)

# Get users
users = api.users.list(page=1, limit=10)

# Create session
session = api.sessions.create(
    title='JavaScript Fundamentals',
    description='Learn the basics',
    skill='JavaScript',
    skill_level='beginner',
    scheduled_at='2024-01-15T14:00:00.000Z',
    duration=60,
    type='online'
)
```

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial API release
- User authentication and management
- Session booking and management
- Skill matching algorithm
- Real-time messaging
- Review system
- Admin dashboard
- PWA support

### Version 1.1.0 (Planned)
- Video conferencing integration
- File upload and sharing
- Advanced search and filtering
- Push notifications
- Webhook support
- Rate limiting improvements

## Support

For API support and questions:
- **Documentation**: https://docs.skillshare.com/api
- **Support Email**: api-support@skillshare.com
- **Status Page**: https://status.skillshare.com
- **GitHub Issues**: https://github.com/skillshare/api/issues
