/**
 * Routes for the Key-Value operations
 */
const express = require('express');
const router = express.Router();
const kvController = require('../controllers/kvController');

// Public key-value pair routes
router.get('/:key', kvController.getValue);
router.post('/', kvController.putValue);

// Private data collection routes
router.post('/private', kvController.putPrivateMessage);
router.get('/private/:collection', kvController.getPrivateMessage);
router.post('/private/verify', kvController.verifyPrivateMessage);

module.exports = router;