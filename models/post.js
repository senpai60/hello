const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim: true,
    maxlength: 2200 // insta caption limit
  },
  // We're making the image field optional by removing 'required: true'
  image: {
    type: String, // AWS, Cloudinary ya server ka URL
    default: null
  },
  videoUrl: {
    type: String // optional, agar video post h
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // post kisne banaya
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
  tags: [String], // #hashtag support
  mentions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } // @mentions
  ],
  location: {
    type: String // optional location/tag
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);
