const express = require("express");
const router = express.Router();
const {
  createMedia,
  getAllMedia,
  getMediaById,
  getMediaByCategory,
  updateMedia,
  deleteMedia,
  getAllAudios,
  getAllVideos,
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
    { name: "thumbnail", maxCount: 1 },
  ]),
  createMedia
);
router.get('/get-by-id/:id', getMediaById)
router.get('/get-by-category/:id', getMediaByCategory)
router.get('/get-all', getAllMedia)

router.get('/audios', getAllAudios)
router.get('/videos', getAllVideos)

router.put('/update-media/:id', updateMedia)
router.delete('/delete-media/:id', deleteMedia)

module.exports = router;
