//require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { convertToHLS } = require('./convert'); // we'll create this

// Prepare folders
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const HLS_DIR = path.join(__dirname, 'public', 'hls');

const app = express();
app.use(cors()); // allow your frontend to request files

// Serve converted HLS files from /public/hls
app.use('/hls', express.static(path.join(__dirname, 'public', 'hls')));

app.get('/', (req, res) => res.send('Video HLS backend is running'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(HLS_DIR)) fs.mkdirSync(HLS_DIR, { recursive: true });

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const uploadedPath = req.file.path; // e.g., uploads/12345.mp4
    const videoId = path.basename(req.file.filename, path.extname(req.file.filename));
    const outDir = path.join(HLS_DIR, videoId);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // convertToHLS will spawn ffmpeg to create playlist and segments in outDir
    await convertToHLS(uploadedPath, outDir, 'playlist');

    // after conversion, `playlist.m3u8` lives in /public/hls/<videoId>/playlist.m3u8
    const playlistUrl = `/hls/${videoId}/playlist.m3u8`;
    return res.json({ success: true, videoId, playlistUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

