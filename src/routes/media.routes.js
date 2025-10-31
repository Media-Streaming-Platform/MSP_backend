const express = require("express");
const router = express.Router();
const {
  createMedia,
  getMediaById
} = require("../controllers/media.controller");
const upload = require('../middleware/uploads')

// For single file upload
router.post(
  "/upload-media",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "title", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "type", maxCount: 1 },
    { name: "categoryId", maxCount: 1 },
  ]),
  createMedia
);
router.get('/get-by-id/:id', getMediaById)

module.exports = router;
