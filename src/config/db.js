const mongoose = require('mongoose')
const MONGO_URI = require('./keys').DB_STRING_DEV;

const connectMongoAtlas = async() => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Mongo atlas connected successfully!!')
  } catch (error) {
    console.log('Mongo atlas not connected')
    process.exit(1)
  }
}

module.exports = connectMongoAtlas