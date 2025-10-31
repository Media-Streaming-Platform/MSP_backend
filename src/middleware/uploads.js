const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Folder to temporarily store uploaded media
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "audio/mpeg", "audio/mp3"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only MP4 and MP3 files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 1024 } }); // ~1GB

module.exports = upload;
