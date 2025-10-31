const {Vimeo} = require('@vimeo/vimeo')
const fs = require('fs')
const path = require('path')

const {
  VIMEO_CLIENT_ID,
  VIMEO_CLIENT_SECRET,
  VIMEO_ACCESS_KEY 
} = require('../config/keys')

const client = new Vimeo(
  VIMEO_CLIENT_ID,
  VIMEO_CLIENT_SECRET,
  VIMEO_ACCESS_KEY
)
const uploadVideoToVimeo = (filePath, originalName, title, description) => {
  return new Promise((resolve, reject) => {
    // const tempPath = path.join(__dirname, '..', 'uploads', originalName);
    client.upload(
      filePath,
      {
        name: title,
        description: description,
        privacy: { view: 'unlisted' }, 
      },
      function (uri) {
        console.log('Video uploaded successfully:', uri);
        resolve(uri.split('/').pop()); // Extract video ID

        //  Delete temp file after upload 
        fs.unlink(filePath, (err) => {
          if (err) console.error("❌ Error deleting file:", err);
          else console.log("🗑️ File deleted successfully:", filePath);
        });
      },
      function (bytesUploaded, bytesTotal) {
        console.log(`Uploading: ${((bytesUploaded / bytesTotal) * 100).toFixed(2)}%`);
      }, 
      function (error) {
        console.error('Failed to upload:', error);
        fs.unlinkSync(filePath); 
        reject(error);
      }
    );
  });
};

module.exports = { uploadVideoToVimeo };