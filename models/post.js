const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: { // 'content' ko 'caption' se replace kiya
    type: String,
    trim: true,
    maxlength: 2200 // insta caption limit
  },
  image: {
    type: String, 
    default: null
  },
  videoUrl: {
    type: String, 
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
      text: { type: String, required: true }, 
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