const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dmgndixuq",
  api_key: "587185958238565",
  api_secret: "enFpzfextBnK3TZPWEKm0TsAUsM",
  secure: true // Recommended for secure HTTPS URLs
});


module.exports = cloudinary;