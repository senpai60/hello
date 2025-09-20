const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const User = require("../models/user");
const upload = require("../middleware/multer");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail })
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.redirect("/auth/login");
    }

    const userWithStats = {
      ...user._doc,
      stats: {
        posts: user.posts.length,
        followers: user.followers.length,
        following: user.following.length,
      },
    };

    res.render("pages/profile", {
      user: userWithStats,
      posts: user.posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post(
  "/update",
  isLoggedIn,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updates = {
        username: req.body.username,
        bio: req.body.bio,
        location: req.body.location,
        website: req.body.website,
      };

      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).send("User not found.");
      }

      if (req.files["profilePic"]) {
        // Delete the old profile picture if it exists and is not the default
        if (user.profilePic && user.profilePic !== "default-avatar.png") {
          const oldProfilePicPath = path.join(__dirname, '..', 'public', 'uploads', 'profilePics', user.profilePic.split('/').pop());
          fs.unlink(oldProfilePicPath, (err) => {
            if (err) {
              console.error("Failed to delete old profile picture:", err);
            }
          });
        }
        updates.profilePic = "/uploads/profilePics/" + req.files["profilePic"][0].filename;
      }

      if (req.files["coverPhoto"]) {
        // Add similar deletion logic for cover photo if needed
        if (user.coverPhoto && user.coverPhoto !== "default-avatar.png") {
          const oldCoverPhotoPath = path.join(__dirname, '..', 'public', 'uploads', 'coverPhotos', user.coverPhoto.split('/').pop());
          fs.unlink(oldCoverPhotoPath, (err) => {
            if (err) {
              console.error("Failed to delete old cover photo:", err);
            }
          });
        }
        updates.coverPhoto = "/uploads/coverPhotos/" + req.files["coverPhoto"][0].filename;
      }

      await User.findOneAndUpdate(
        { email: req.user.email },
        { $set: updates },
        { new: true }
      );

      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;