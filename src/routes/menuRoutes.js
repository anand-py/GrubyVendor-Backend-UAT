const express = require('express');
const { manageMenu } = require('../controller/menuController.js');
// const { authenticate } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/menu', manageMenu);

module.exports = router;
