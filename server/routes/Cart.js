const express = require('express');
const router = express.Router();

const { addToCart, removeFromCart, getFullCartDetails } = require('../controllers/Cart');
const { auth, isStudent } = require('../middlewares/auth');

router.post("/addItem", auth, isStudent, addToCart);
router.post("/removeItem", auth, isStudent, removeFromCart);
router.post("/getCart", auth, isStudent, getFullCartDetails);

module.exports = router;