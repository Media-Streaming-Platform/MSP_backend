const Media = require("../models/media.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Create media (video/audio)
const createMedia = async (req, res) => {
  try {
    const { title, description, type, categoryId } = req.body;

    // Validate category
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Invalid category ID" });

    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const uploadedFilePath = req.files.file[0].path;
    const mediaFileName = path.basename(uploadedFilePath, path.extname(uploadedFilePath));
    const hlsOutputDirectory = path.join(__dirname, "..", "uploads", "hls", mediaFileName);
    const hlsMasterPlaylistPath = path.join(hlsOutputDirectory, "master.m3u8");

    // Create HLS output directory if it doesn't exist
    if (!fs.existsSync(hlsOutputDirectory)) {
      fs.mkdirSync(hlsOutputDirectory, { recursive: true });
    }

    const ffmpegCommand = `ffmpeg -i "${uploadedFilePath}" -codec:v libx264 -preset veryfast -crf 23 -codec:a aac -b:a 128k -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${hlsOutputDirectory}/%03d.ts" "${hlsMasterPlaylistPath}"`;

    exec(ffmpegCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error(`FFmpeg conversion error: ${error.message}`);
        return res.status(500).json({ message: "Server error", error: "Failed to convert media to HLS" });
      }
      console.log(`FFmpeg stdout: ${stdout}`);
      console.error(`FFmpeg stderr: ${stderr}`);

      // Delete the original uploaded file after successful conversion
      fs.unlink(uploadedFilePath, (err) => {
        if (err) console.error("Error deleting original file:", err);
        else console.log("Original file deleted:", uploadedFilePath);
      });

      const newMedia = new Media({
        title,
        description,
        type,
        categories: category._id,
        filePath: hlsMasterPlaylistPath, // Store the HLS master playlist path
        isPublished: true,
      });

      await newMedia.save();

      res.status(201).json({ message: "Media uploaded successfully", media: newMedia });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all media
const getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.find().populate("categories", "name").sort({ createdAt: -1 });
    res.json(mediaList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get media by ID
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate("categories", "name");
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update media metadata (title, description, category)
const updateMedia = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (title) media.title = title;
    if (description) media.description = description;
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).json({ message: "Invalid category ID" });
      media.categories = category._id;
    }

    await media.save();
    res.json({ message: "Media updated successfully", media });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Optional: delete from Vimeo if video
    // client.request({ method: 'DELETE', path: `/videos/${media.vimeoVideoId}` }, ...)

    await media.remove();
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
