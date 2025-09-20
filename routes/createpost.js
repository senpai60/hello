const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const upload = require("../middleware/multer");
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");

router.post("/create", isLoggedIn, (req, res) => {
    upload.single("image")(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err.message);
                return res.status(400).send(`Multer Error: ${err.message}`);
            } else if (err) {
                console.error("File Upload Error:", err.message);
                return res.status(400).send(`File Upload Error: ${err.message}`);
            }

            console.log("Request Body:", req.body); // 👈 Logs all form data
            console.log("Received caption:", req.body.caption); // 👈 Logs only the caption

            const { caption } = req.body;
            const imagePath = req.file ? "/uploads/posts/" + req.file.filename : null;

            if (!caption && !imagePath) {
                return res.status(400).send("Post must contain either a caption or an image.");
            }

            const user = await User.findOne({ email: req.user.email });
            if (!user) {
                return res.status(404).send("User not found.");
            }

            const newPost = new Post({
                caption: caption,
                image: imagePath,
                user: user._id,
            });

            await newPost.save();
            user.posts.push(newPost._id);
            await user.save();

            res.redirect("/");
        } catch (dbErr) {
            console.error(dbErr);
            res.status(500).send("Server error");
        }
    });
});

module.exports = router;