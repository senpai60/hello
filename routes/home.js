const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user").sort({ createdAt: -1 });

    const users = await User.find();

    // Pass the current logged-in user to EJS
    const currentUser = res.locals.user;

    res.render("index", { posts, users, currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
