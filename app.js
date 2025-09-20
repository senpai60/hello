const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');




mongoose.connect("mongodb://localhost:27017/plato", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
  });

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("public"));

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Import Models
// Top-Levels
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const JWT_SECRET = "supersecretkey";

// app.js global middleware
app.use(async (req, res, next) => {
    const token = req.cookies.token; // <- same as isLoggedIn
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findOne({ email: decoded.email });
            res.locals.user = user;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});



//Import Route
const homeRouter = require("./routes/home");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const createPostRouter = require("./routes/createpost");
const messengerRouter = require("./routes/messenger");



app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/auth", authRouter);
app.use("/createpost", createPostRouter);
app.use("/messenger", messengerRouter);

// Static files

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
