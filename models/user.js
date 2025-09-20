const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: "default-avatar.png"
  },
  coverPhoto: {
    type: String,
    default: "default-avatar.png"
  },
  bio: {
    type: String,
    maxlength: 150
  },
  location: {   // 👈 add this
    type: String,
    trim: true
  },
  website: {    // 👈 add this
    type: String,
    trim: true
  },
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
  ]
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
