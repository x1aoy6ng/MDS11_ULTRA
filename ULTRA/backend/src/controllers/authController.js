const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const rateLimit = require('express-rate-limit');
const { error } = require('console');

// in-memory store for passcode (use Redis/Database)
const passcodeStore = new Map()

// email configuration
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { 
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// limit the repeated requests to passcode
const passcodeRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes (in milliseconds)
    max: 5, // maximum 5 requests per window per IP
    message: {error: 'Too many passcode requests. Please try again later.'},
    standardHeaders: true,
    legacyHeaders: false
});

// generate 6 digit passcode
const generatePasscode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// validate the email
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// send passcode to email
const sendPasscodeEmail = async (email, passcode) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Verification code',
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#333;">Your verification code</h2>
            <p>Hi,</p>
            <p>Thank you for choosing ULTRA</p>
            <p>Your verification code is:</p>
            <div style="background:#f5f5f5;padding:20px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:5px;margin:20px 0;">
            ${passcode}
            </div>
            <p>This code will expire in 10 minutes. If you didn't request it, you can ignore this email.</p>
        </div>
        `,
    };

    await emailTransporter.sendMail(mailOptions);
}

const sendPasscode = async(req, res) => {
    try {
        const {email} = req.body;

        // validate whether user input email
        if (!email){
            return res.status(400).json({error: 'Email is required'});
        }   

        // validate whether email in correct format
        if (!isValidEmail(email)){
            return res.status(400).json({error: 'Invalid email format'});
        }

        // IF VALID
        const normalisedEmail = email.toLowerCase();
        // generate passcode
        const passcode = generatePasscode();
        const expiresAt = Date.now() + 10 * 60 * 1000;  // 10 minutes

        // store the passcode 
        passcodeStore.set(normalisedEmail, { code: passcode, expiresAt, attempts: 0 });

        // send the email
        await sendPasscodeEmail(email, passcode)
        // debug - check whether correct
        console.log(`Passcode for ${email}: ${passcode}`);

        res.json({
            message: 'Passcode sent successfully',
            email: normalisedEmail,
        });
    } catch (error) {
        console.error('Error sending passcode: ', error)
        res.status(500).json({error: 'Failed to send passcode'})
    }
}

const verifyPasscode = async (req, res) => {
    try {
        const {email, passcode} = req.body;

        // validate whether user input passcode
        if (!email || !passcode){
            return res.status(400).json({error: 'Email and passcode are required'});
        }

        // validate whether passcode in correct format (only digit)
        if (! /^\d*$/.test(passcode)){
            return res.status(400).json({error: 'Invalid passcode format'});
        }

        const normalisedEmail = email.toLowerCase();
        const storedData = passcodeStore.get(normalisedEmail);

        // check whether the passcode exists
        if (!storedData){
            return res.status(400).json({error: 'No passcode found. Please request a new one.'});
        }

        // check the attempts (prevent user from brute force)
        if (storedData.attempts >= 3){
            passcodeStore.delete(normalisedEmail);
            return res.status(429).json({error: "Too many failed attempts. Please request a new passcode."});
        }

        // check whether the passcode expires
        if (Date.now() > storedData.expiresAt){
            passcodeStore.delete(normalisedEmail);
            return res.status(400).json({error: 'Passcode has expired. Please request a new one.'});
        };

        // verify the passcode
        if (storedData.code !== passcode){
            storedData.attempts++;
            return res.status(400).json({error: 'Invalid passcode', attemptLeft: 3 - storedData.attempts});
        }

        // SUCCESS
        // generate the JWT
        const token = jwt.sign(
            {
                email: normalisedEmail,
                userId: normalisedEmail
            },
            process.env.JWT_SECRET,
               {expiresIn: '7d'}
        );

        // clean up passcode
        passcodeStore.delete(normalisedEmail);

        // change if need set secure HTTP-only cookie instead of sending token

        res.json({
            message: 'Login successful',
            token,
            user: {
                email: normalisedEmail
            },
        });
    } catch (error){
        console.error('Error in verifying passcode: ', error);
        res.status(500).json({error: 'Failed to verify passcode'});
    }
}

const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout: ', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.user;
    res.json({ user: { email } });
  } catch (error) {
    console.error('Error in getting profile: ', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = {
    passcodeRateLimit,
    sendPasscode,
    verifyPasscode,
    logout,
    getProfile
};