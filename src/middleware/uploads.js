const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Folder to temporarily store uploaded media
const uploadPath = path.join(__dirname, "..", "uploads");
const thumbnailUploadPath = path.join(uploadPath, "thumbnail");

if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
if (!fs.existsSync(thumbnailUploadPath)) fs.mkdirSync(thumbnailUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, thumbnailUploadPath);
    } else {
      cb(null, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, or GIF images are allowed for thumbnails!"), false);
    }
  } else if (file.fieldname === "file") {
    const allowedMediaTypes = ["video/mp4", "audio/mpeg", "audio/mp3"];
    if (!allowedMediaTypes.includes(file.mimetype)) {
      return cb(new Error("Only MP4 and MP3 files are allowed for media uploads!"), false);
    }
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 1024 } }); // ~1GB

module.exports = upload;
