require('dotenv').config()

module.exports = {
  DB_STRING_DEV: process.env.DB_STRING_DEV,
  VIMEO_CLIENT_ID: process.env.VIMEO_CLIENT_ID,
  VIMEO_CLIENT_SECRET: process.env.VIMEO_CLIENT_SECRET,
  VIMEO_ACCESS_KEY: process.env.VIMEO_ACCESS_KEY,
}