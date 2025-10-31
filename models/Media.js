import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
  description: String,
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  duration: Number,
  fileSize: Number,
  quality: [String],
  category: {
    id: String,
    name: String
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [String],
  metadata: {
    director: String,
    releaseYear: Number,
    language: String
  },
  status: {
    type: String,
    default: 'ready'
  }
}, {
  timestamps: true
});

export default mongoose.model('Media', mediaSchema);