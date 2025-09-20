const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const User = require("../models/user");
const TextPost = require("../models/textpost");

router.post("/textpost", isLoggedIn, async (req, res) => {
  try {
    const { text } = req.body;
    const userData = req.user;
    const user = await User.findOne({ email: userData.email });
    if (!user) res.redirect("/");
    const createdTextPost = await TextPost.create({
      text: text,
      user: user._id,
      createdAt: new Date(),
    });
    await createdTextPost.save()
    res.redirect('/')
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});
router.post('/mediapost',isLoggedIn,(req,res)=>{
    
})

module.exports = router;
