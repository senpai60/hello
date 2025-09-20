const express = require('express');
const router = express.Router();

// Public feed data
const posts = require('../data/posts');
const users = require('../data/users');
const trending = require('../data/trending');

router.get('/', (req, res) => {
    res.render('index', { posts, users, trending });
});

module.exports = router;
