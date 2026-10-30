const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', authenticate, authorizeRoles('admin'), roomController.createRoom);
router.put('/:id', authenticate, authorizeRoles('admin', 'staff'), roomController.updateRoom);
router.delete('/:id', authenticate, authorizeRoles('admin'), roomController.deleteRoom);
router.patch('/:id/housekeeping', authenticate, authorizeRoles('admin', 'staff'), roomController.updateHousekeeping);

module.exports = router;

