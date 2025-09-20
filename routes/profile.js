const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const User = require("../models/user");
const upload = require("../middleware/multer");
const Post = require("../models/post"); // make sure you have a Post model

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Fetch user and populate posts
    const user = await User.findOne({ email: userEmail })
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } }, // latest posts first
      })
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.redirect("/auth/login");
    }

    // Prepare stats object for EJS
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
      posts: user.posts, // real posts from DB
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
        username: req.body.username, // 👈 form me bhi "username" kar
        bio: req.body.bio,
        location: req.body.location,
        website: req.body.website,
      };

      if (req.files["profilePic"]) {
        updates.profilePic =
          "/uploads/profilePics/" + req.files["profilePic"][0].filename;
      }
      if (req.files["coverPhoto"]) {
        updates.coverPhoto =
          "/uploads/coverPhotos/" + req.files["coverPhoto"][0].filename;
      }

      // Update user in DB
      await User.findOneAndUpdate(
        { email: req.user.email },
        { $set: updates },
        { new: true } // 👈 ensures updated document is returned
      );

      // Redirect to profile, fresh fetch hoga
      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
