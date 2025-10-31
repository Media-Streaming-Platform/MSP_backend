// test-connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🚀 Starting MongoDB Connection Test...\n');

// Check if connection string exists
if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('💡 Make sure your .env file has: MONGODB_URI=your_connection_string');
  process.exit(1);
}

console.log('✅ MONGODB_URI found in .env file');
console.log('📋 Connection string starts with:', process.env.MONGODB_URI.substring(0, 50) + '...\n');

const testConnection = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Display connection info
    console.log('📊 Database Name:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    console.log('');
    
    // List all collections
    console.log('📁 Fetching collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Available collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    console.log('');
    
    // Test reading from categories collection
    console.log('📋 Testing Categories collection...');
    try {
      const categories = await mongoose.connection.db.collection('categories').find({}).limit(5).toArray();
      console.log(`✅ Found ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat._id})`);
      });
    } catch (error) {
      console.log('❌ Could not read categories:', error.message);
    }
    console.log('');
    
    // Test reading from media collection  
    console.log('🎬 Testing Media collection...');
    try {
      const media = await mongoose.connection.db.collection('media').find({}).limit(3).toArray();
      console.log(`✅ Found ${media.length} media items:`);
      media.forEach(item => {
        console.log(`   - ${item.title} (${item._id})`);
      });
    } catch (error) {
      console.log('❌ Could not read media:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your connection string in .env file');
    console.log('2. Make sure your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify the database user password is correct');
    console.log('4. Check if the database exists');
  } finally {
    // Close connection and exit
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    }
    console.log('\n✨ Test completed!');
    process.exit(0);
  }
};

// Run the test
testConnection();