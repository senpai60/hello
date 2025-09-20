const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { // Renamed from 'caption' for wider use
    type: String,
    trim: true,
    maxlength: 2200 // insta caption limit
  },
  image: {
    type: String, // AWS, Cloudinary or server URL
    default: null
  },
  videoUrl: {
    type: String, // optional
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true }, // 'text' from post.js, 'comment' from textpost.js - unified as 'text'
      createdAt: { type: Date, default: Date.now }
    }
  ],
  tags: [String],
  mentions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  location: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);