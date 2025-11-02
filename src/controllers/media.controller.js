const Media = require("../models/media.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cloudinary = require('../config/cloudnaryConfig');


async function uploadFile(file) {
  try {
    if (!file) throw new Error("No file provided");

    // Determine resource type
    let resourceType = "image"; // default
    if (file.mimetype.startsWith("video")) resourceType = "video";
    else if (file.mimetype.startsWith("audio")) resourceType = "raw";

    const result = await cloudinary.uploader.upload( file.path, {
      resource_type: resourceType,
    });

    // Delete local temp file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    console.log("File uploaded successfully:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error.message || "Cloudinary upload failed");
  }
}



// Create media (video/audio)
const createMedia = async (req, res) => {
  try {
   // console.log("--", req);
    const {title, description, type, categoryId } = req.body;
  
    // Validate category
    console.log(categoryId)
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(400).json({ message: "Invalid category ID" });

    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).json({ message: "Media file is required" });
    }
    
    // const uploadedFilePath = req.files.file[0].path;
    // const mediaFileName = path.basename(uploadedFilePath, path.extname(uploadedFilePath));
    // const hlsOutputDirectory = path.join(__dirname, "..", "uploads", "hls", mediaFileName);
    // const hlsMasterPlaylistPath = path.join(hlsOutputDirectory, "master.m3u8");
    // console.log("f", req.files);
    // console.log("f", req.files.file[0]);
    // console.log(req.files.file[0].mimetype);
    // return
    const filePath = await uploadFile(req.files.file[0]);
    const thumbnailPath = await uploadFile(req.files.thumbnail[0]);


      const newMedia = new Media({
        title,
        description,
        type,
        categories: category._id,
        filePath: filePath, // Store the HLS master playlist path
        isPublished: true,
        thumbnail:thumbnailPath
      });

      await newMedia.save();
      res.status(200).json({nessage: "Media saved"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all media
const getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.find()
      .populate("categories", "name")
      .sort({ createdAt: -1 });
    const audioCount = await Media.countDocuments({ type: "audio" });
    const videoCount = await Media.countDocuments({ type: "video" });

    res.json({ mediaList, audioCount, videoCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get media by ID
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate(
      "categories",
      "name"
    );
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
      if (!category)
        return res.status(400).json({ message: "Invalid category ID" });
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
    //use findByIdAndDelete
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get media by category
const getMediaByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaList = await Media.find({ categories: id })
      .populate("categories", "name")
      .sort({ createdAt: -1 });
    res.json(mediaList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all audios
const getAllAudios = async (req, res) => {
  try {
    const audioList = await Media.find({ type: "audio" })
      .populate("categories", "name")
      .sort({ createdAt: -1 });
    res.json(audioList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all videos
const getAllVideos = async (req, res) => {
  try {
    const videoList = await Media.find({ type: "video" })
      .populate("categories", "name")
      .sort({ createdAt: -1 });
    res.json(videoList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getMediaByCategory,
  getAllAudios,
  getAllVideos,
};
