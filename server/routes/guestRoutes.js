const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticate, authorizeRoles('admin', 'staff'), guestController.getAllGuests);
router.get('/:id', authenticate, authorizeRoles('admin', 'staff'), guestController.getGuestById);
router.patch('/:id/vip', authenticate, authorizeRoles('admin'), guestController.updateGuestVip);

module.exports = router;

