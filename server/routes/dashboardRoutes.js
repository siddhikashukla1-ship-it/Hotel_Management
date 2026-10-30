const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/analytics', authenticate, authorizeRoles('admin', 'staff'), dashboardController.getAnalytics);

module.exports = router;

