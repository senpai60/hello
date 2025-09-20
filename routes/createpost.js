const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const upload = require("../middleware/multer");
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");

// Route to handle text-only posts
router.post("/textpost", isLoggedIn, async (req, res) => {
  try {
    const { text } = req.body;
    const userData = req.user;
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.redirect("/");
    }
    
    // Create a new post instance using the existing Post model
    const createdPost = new Post({
      caption: text,
      user: user._id,
      createdAt: new Date(),
    });
    
    // Save the new post to the database
    await createdPost.save();

    // Update the user's posts array
    user.posts.push(createdPost._id);
    await user.save();
    
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});


// Route to handle media posts
router.post("/mediapost", isLoggedIn, (req, res) => {
    // Multer middleware with a callback to handle errors
    upload.single("image")(req, res, async (err) => {
        try {
            // Check for Multer-specific errors first
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err.message);
                return res.status(400).send(`Multer Error: ${err.message}`);
            } else if (err) {
                // Handle other generic errors from the file filter
                console.error("File Upload Error:", err.message);
                return res.status(400).send(`File Upload Error: ${err.message}`);
            }

            // At this point, no Multer errors occurred, so proceed with the post
            const { caption } = req.body;

            // Check if req.file exists
            const imagePath = req.file ? "/uploads/posts/" + req.file.filename : null;

            if (imagePath === null && !caption) {
                return res.status(400).send("Post must contain either a caption or an image.");
            }

            // Find the user who created the post using the data from the auth middleware
            const user = await User.findOne({ email: req.user.email });
            if (!user) {
                return res.status(404).send("User not found.");
            }

            // Create a new post instance
            const newPost = new Post({
                caption: caption,
                image: imagePath,
                user: user._id,
            });

            // Save the new post to the database
            await newPost.save();

            // Update the user's posts array
            user.posts.push(newPost._id);
            await user.save();

            res.redirect("/"); // Redirect back to the home page after posting
        } catch (dbErr) {
            console.error(dbErr);
            res.status(500).send("Server error");
        }
    });
});

module.exports = router;
