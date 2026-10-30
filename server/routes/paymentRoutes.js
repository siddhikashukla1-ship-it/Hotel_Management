const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorizeRoles, optionalAuth } = require('../middleware/auth');

router.get('/', authenticate, authorizeRoles('admin', 'staff'), paymentController.getAllPayments);
router.get('/invoice/:invoiceNumber', paymentController.getInvoice);
router.post('/process', optionalAuth, paymentController.processPayment);

module.exports = router;
