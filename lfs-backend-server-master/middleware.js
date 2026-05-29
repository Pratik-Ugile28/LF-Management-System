require('dotenv').config();
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment')
  process.exit(1)
}

exports.requireSignin = (req, res, next) => {
    console.log("Inside require sign in", req.headers.authorization)

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log("Header Verification")
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        console.log("Cookie Verification")
        token = req.cookies.jwt;
    }

    if (!token) {
        console.log("No Authorization")
        return res.status(401).json({ message: "No Authorization" });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)
        req.user = user
        req.role = 'user'
        next()
    } catch (error) {
        console.error('JWT verification failed:', error)
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

exports.userMiddleware = (req, res, next) => {
    console.log("Inside usermiddleware")
    if (req.role !== "user") {
        return res.status(403).json({ message: "Access Denied" })
    }
    next()
}

