const express = require('express');
const { viewTransactionHistory } = require('../controller/transactionController');
// const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/transactionHistory', viewTransactionHistory);

module.exports = router;
