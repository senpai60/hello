const jwt = require('jsonwebtoken');
const JWT_SECRET = "supersecretkey";

const isLoggedIn =(req,res,next)=> {
    const token = req.cookies.token
    if (!token) return res.redirect('/auth/login');
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.redirect('/auth/login');
    }
}
module.exports = isLoggedIn;