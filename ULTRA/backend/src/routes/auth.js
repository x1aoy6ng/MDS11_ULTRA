const express = require('express')
const authController = require('../controllers/authController.js');
const {authenticateToken} = require('../middleware/authMiddleware.js');

const router = express.Router();

// DEBUG Purpose - make sure all are function type
// console.log('sendPasscode:', typeof authController.sendPasscode);
// console.log('verifyPasscode:', typeof authController.verifyPasscode);
// console.log('logout:', typeof authController.logout);
// console.log('getProfile:', typeof authController.getProfile);
// console.log('authenticateToken:', typeof authenticateToken);

// public routes
router.post('/send-passcode', authController.sendPasscode);
router.post('/verify-passcode', authController.verifyPasscode);

// protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;