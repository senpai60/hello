const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const trendingData = require('../data/trending');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user').sort({ createdAt: -1 });
        const users = await User.find();
        const currentUser = res.locals.user;
        const trending = trendingData;

        res.render('index', { posts, users, currentUser, trending });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;