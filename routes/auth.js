const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = "supersecretkey";

// Signup page
router.get('/signup', (req, res) => {
    res.render('pages/signup');
});

// Create user
router.post('/createuser', async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).send("User already exists with this email.");

        const hashPassword = await bcrypt.hash(password, 10);

        const createdUser = new User({
            username,
            fullName,
            email,
            password: hashPassword
        });
        await createdUser.save();

        const token = jwt.sign({ email }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('pages/login', { error: null });
});

// Login
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('pages/login', { error: "Please check your email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('pages/login', { error: "Please check your email or password." });
        }

        const token = jwt.sign({ email }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
    } catch (err) {
        res.render('pages/login', { error: "Something went wrong. Try again." });
    }
});


// ✅ Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // clear JWT cookie
    res.redirect('/'); // redirect to home page
});

module.exports = router;
