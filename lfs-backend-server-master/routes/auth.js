const express = require('express');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const Signup = require('../models/signup');
const { requireSignin } = require('../middleware');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const router = express.Router(); // Ensure router is defined here

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '1h';
const NODE_ENV = process.env.NODE_ENV;

const signJwt = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    });
};

const sendToken = (user, statuscode, req, res) => {
    const token = signJwt(user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        secure: NODE_ENV === 'production',
        httpOnly: NODE_ENV === 'production'
    });
    console.log("Inside send token");
    const userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;
    res.status(statuscode).json({
        token,
        user: userData
    });
};


const signout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({
        message: "Signed out successfully!"
    });
};

const decryptJwt = async (token) => {
    const jwtverify = promisify(jwt.verify);
    return await jwtverify(token, JWT_SECRET);
};

const secure = async (req, res, next) => {
    let token;
    if (req.cookies) token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            status: "unauthorized",
            message: "You are not authorized to view the content"
        });
    }
    const jwtInfo = await decryptJwt(token);
    console.log(jwtInfo);
    const user = await Signup.findById(jwtInfo.id);
    req.user = user;
    next();
};

const checkField = (req, res, next) => {
    const { email, password, cpassword } = req.body;
    if (!email || !password || !cpassword) {
        console.log('Please enter all the fields');
        return res.status(400).send('Please enter all the fields');
    }
    next();
};

const checkFieldLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Please enter all the fields');
        return res.status(400).send('Please enter all the fields');
    }
    next();
};

const checkUsername = (req, res, next) => {
    const { email } = req.body;
    Signup.findOne({ email: email }).exec((err, data) => {
        if (err) throw err;
        if (data) {
            console.log('Email Exists');
            return res.status(400).send('Email already exists');
        }
        next();
    });
};

const checkPassword = (req, res, next) => {
    const { password, cpassword } = req.body;
    if (password !== cpassword) {
        console.log('Password did not match');
        return res.status(400).send('Password did not match');
    }
    next();
};

router.get('/', (req, res) => res.send("This is Home page !!"));

router.post('/signup', checkField, checkUsername, checkPassword, async (req, res) => {
    console.log("Signup :", req.body);
    const { firstname, lastname, email, number, password } = req.body;
    try {
        const newSignup = await Signup.create({
            firstname,
            lastname,
            email,
            number,
            password
        });
        console.log(newSignup);
        res.send("Done");
    } catch (err) {
        res.status(401).json(err.message);
    }
});

router.post('/login', checkFieldLogin, async (req, res) => {
    console.log('Login :', req.body);
    const { email, password } = req.body;

    try {
        const user = await Signup.findOne({ email: email }).exec();

        if (!user) {
            console.log('Not exist');
            return res.status(404).send("Email does not exist");
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (isPasswordCorrect) {
            console.log("Logging in");
            sendToken(user, 200, req, res);
            console.log("Login successful");
        } else {
            console.log('Please check again!');
            res.status(400).send("Password Incorrect");
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send("Server Error");
    }
});

router.post('/checktoken', requireSignin, (req, res) => {
    res.status(200).json({});
});

router.post('/signout', requireSignin, signout);

router.post('/feed', requireSignin, (req, res) => res.status(200).json({
    message: "Working fine"
}));

router.post('/sendmessage', async (req, res) => {
    console.log('sendmessage payload:', req.body);
    const { name, email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ success: false, error: 'Missing email or message' });
    }

    // Prepare transporter: prefer Mailgun, fallback to SMTP
    let transporter;
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
        const auth = {
            auth: {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN,
            }
        };
        transporter = nodemailer.createTransport(mg(auth));
    } else if (process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.GMAIL_USER)) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: (process.env.SMTP_SECURE === 'true'),
            auth: {
                user: process.env.SMTP_USER || process.env.GMAIL_USER,
                pass: process.env.SMTP_PASS || process.env.GMAIL_PASS,
            }
        });
    } else {
        console.error('No mailer configuration found');
        return res.status(500).json({ success: false, error: 'No mail configuration found' });
    }

    const from = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || `no-reply@${process.env.MAILGUN_DOMAIN || 'localhost'}`;

    const mailOptions = {
        from: `${name || 'FindHUB User'} <${from}>`,
        to: email,
        subject: `Message from ${name || 'a user'} via FindHUB`,
        text: message,
        html: `<p>${message}</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent:', info);
        res.status(200).json({ success: true, info });
    } catch (err) {
        console.error('Mail send error:', err);
        res.status(500).json({ success: false, error: 'Failed to send mail', details: err.message });
    }
});

module.exports = router;
