const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const upload = require("../middleware/multer");
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");

// Route to handle all post types (text or media)
router.post("/create", isLoggedIn, (req, res) => {
    // Use Multer middleware to handle the image upload
    // The fieldname 'image' is specified in multer.js for posts
    upload.single("image")(req, res, async (err) => {
        try {
            // Handle Multer-specific errors first
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err.message);
                return res.status(400).send(`Multer Error: ${err.message}`);
            } else if (err) {
                // Handle other generic errors from the file filter
                console.error("File Upload Error:", err.message);
                return res.status(400).send(`File Upload Error: ${err.message}`);
            }

            const { caption } = req.body;
            const imagePath = req.file ? "/uploads/posts/" + req.file.filename : null;

            // Ensure the post has at least a caption or an image
            if (!caption && !imagePath) {
                return res.status(400).send("Post must contain either a caption or an image.");
            }

            // Find the user who created the post
            const user = await User.findOne({ email: req.user.email });
            if (!user) {
                return res.status(404).send("User not found.");
            }

            // Create a new post instance using the unified Post model
            const newPost = new Post({
                caption: caption,
                image: imagePath,
                user: user._id,
            });

            // Save the new post to the database
            await newPost.save();

            // Update the user's posts array
            user.posts.push(newPost._id);
            // It's a good practice to increment a post counter on the user model if one exists.
            await user.save();

            res.redirect("/"); // Redirect back to the home page after posting
        } catch (dbErr) {
            console.error(dbErr);
            res.status(500).send("Server error");
        }
    });
});

module.exports = router;