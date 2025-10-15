import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Local MongoDB connection
const LOCAL_URI = 'mongodb://localhost:27017/skillshare';

// Atlas connection (from .env)
const ATLAS_URI = process.env.MONGODB_URI;

console.log('🔄 Starting Data Migration to MongoDB Atlas...\n');

// Schemas
const UserSchema = new mongoose.Schema({}, { strict: false });
const MessageSchema = new mongoose.Schema({}, { strict: false });
const SessionSchema = new mongoose.Schema({}, { strict: false });
const NotificationSchema = new mongoose.Schema({}, { strict: false });
const MatchRequestSchema = new mongoose.Schema({}, { strict: false });
const ReviewSchema = new mongoose.Schema({}, { strict: false });

async function migrateData() {
  try {
    // Connect to LOCAL MongoDB
    console.log('📍 Connecting to LOCAL MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to LOCAL MongoDB\n');

    // Get models from local
    const LocalUser = localConn.model('User', UserSchema);
    const LocalMessage = localConn.model('Message', MessageSchema);
    const LocalSession = localConn.model('Session', SessionSchema);
    const LocalNotification = localConn.model('Notification', NotificationSchema);
    const LocalMatchRequest = localConn.model('MatchRequest', MatchRequestSchema);
    const LocalReview = localConn.model('Review', ReviewSchema);

    // Fetch all data from local
    console.log('📥 Fetching data from LOCAL database...');
    const users = await LocalUser.find({}).lean();
    const messages = await LocalMessage.find({}).lean();
    const sessions = await LocalSession.find({}).lean();
    const notifications = await LocalNotification.find({}).lean();
    const matchRequests = await LocalMatchRequest.find({}).lean();
    const reviews = await LocalReview.find({}).lean();

    console.log(`   Users: ${users.length}`);
    console.log(`   Messages: ${messages.length}`);
    console.log(`   Sessions: ${sessions.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log(`   Match Requests: ${matchRequests.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    console.log('');

    // Connect to ATLAS MongoDB
    console.log('☁️  Connecting to MongoDB ATLAS...');
    console.log(`   URI: ${ATLAS_URI.replace(/:[^:@]+@/, ':****@')}`);
    
    const atlasConn = await mongoose.createConnection(ATLAS_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).asPromise();
    
    console.log('✅ Connected to MongoDB ATLAS\n');

    // Get models from atlas
    const AtlasUser = atlasConn.model('User', UserSchema);
    const AtlasMessage = atlasConn.model('Message', MessageSchema);
    const AtlasSession = atlasConn.model('Session', SessionSchema);
    const AtlasNotification = atlasConn.model('Notification', NotificationSchema);
    const AtlasMatchRequest = atlasConn.model('MatchRequest', MatchRequestSchema);
    const AtlasReview = atlasConn.model('Review', ReviewSchema);

    // Clear existing data in Atlas (optional)
    console.log('🗑️  Clearing existing data in Atlas...');
    await Promise.all([
      AtlasUser.deleteMany({}),
      AtlasMessage.deleteMany({}),
      AtlasSession.deleteMany({}),
      AtlasNotification.deleteMany({}),
      AtlasMatchRequest.deleteMany({}),
      AtlasReview.deleteMany({})
    ]);
    console.log('✅ Atlas cleared\n');

    // Insert data into Atlas
    console.log('📤 Uploading data to Atlas...');
    
    if (users.length > 0) {
      await AtlasUser.insertMany(users);
      console.log(`   ✅ Uploaded ${users.length} users`);
    }
    
    if (messages.length > 0) {
      await AtlasMessage.insertMany(messages);
      console.log(`   ✅ Uploaded ${messages.length} messages`);
    }
    
    if (sessions.length > 0) {
      await AtlasSession.insertMany(sessions);
      console.log(`   ✅ Uploaded ${sessions.length} sessions`);
    }
    
    if (notifications.length > 0) {
      await AtlasNotification.insertMany(notifications);
      console.log(`   ✅ Uploaded ${notifications.length} notifications`);
    }
    
    if (matchRequests.length > 0) {
      await AtlasMatchRequest.insertMany(matchRequests);
      console.log(`   ✅ Uploaded ${matchRequests.length} match requests`);
    }
    
    if (reviews.length > 0) {
      await AtlasReview.insertMany(reviews);
      console.log(`   ✅ Uploaded ${reviews.length} reviews`);
    }

    console.log('');
    console.log('🎉 MIGRATION COMPLETE!');
    console.log('');
    console.log('Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Messages: ${messages.length}`);
    console.log(`   Total Sessions: ${sessions.length}`);
    console.log(`   Total Notifications: ${notifications.length}`);
    console.log(`   Total Match Requests: ${matchRequests.length}`);
    console.log(`   Total Reviews: ${reviews.length}`);
    console.log('');
    console.log('✅ All data successfully migrated to MongoDB Atlas!');
    console.log('✅ You can now access this data from any laptop!');

    // Close connections
    await localConn.close();
    await atlasConn.close();
    
    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('❌ MIGRATION FAILED!');
    console.error('');
    console.error('Error:', err.message);
    console.error('');
    
    if (err.message.includes('ENOTFOUND')) {
      console.error('🌐 Atlas cluster is not reachable yet.');
      console.error('   Please wait for the cluster to be fully provisioned.');
      console.error('   Check status at: https://cloud.mongodb.com/');
    } else if (err.message.includes('authentication')) {
      console.error('🔑 Authentication failed.');
      console.error('   Check your username and password in the connection string.');
    }
    
    process.exit(1);
  }
}

migrateData();

