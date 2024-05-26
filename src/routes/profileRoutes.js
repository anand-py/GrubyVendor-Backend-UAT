const express = require('express');
const { updateProfile } = require('../controller/profileController');

const router = express.Router();

// Update profile using vendor ID
router.put('/profile/:vendorId', updateProfile);

module.exports = router;
