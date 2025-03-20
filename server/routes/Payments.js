// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth")


// ********************************************************************************************************
//                                      Payment routes
// ********************************************************************************************************

// route for capturing and initiating the payment
router.post("/capturePayment", auth, isStudent, capturePayment)

// route to verify signature of razorpay and server
router.post("/verifyPayment", auth, isStudent, verifyPayment)

// route to send payment successfull email to student
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router