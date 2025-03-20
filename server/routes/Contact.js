const express = require('express');
const router = express.Router();

// import controller
const { contactUs } = require('../controllers/Contact');

router.post('/contact', contactUs);

module.exports = router;