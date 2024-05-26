const express = require('express');
const { signup, login, sendOtp } = require('../controller/authController'); // Import the sendOtp function

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/sendotp', sendOtp); 

module.exports = router;
  