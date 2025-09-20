const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/auth');


router.get("/", isLoggedIn, async (req, res) => {
  res.render('./pages/messenger')
});

module.exports = router