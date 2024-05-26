const express = require('express');
const { viewOrders, manageOrderStatus } = require('../controller/orderController');
// const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', viewOrders);
router.post('/:orderId/status', manageOrderStatus);

module.exports = router;
