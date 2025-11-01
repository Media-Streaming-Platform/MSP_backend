// import mongoose from "mongoose";
const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["video", "audio"], required: true }, // differentiate between video & audio
  categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

  filePath: { type: String, required: true },

  numberOfViews: { type: Number, default: 0 },
  thumbnail: { type: String },

  // Upload details
  isPublished: { type: Boolean, default: false },

}, { timestamps: true });

const Media =  mongoose.model("Media", mediaSchema);

module.exports = Media
