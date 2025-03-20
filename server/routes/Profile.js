const express = require("express")
const router = express.Router()
const { auth, isInstructor, isStudent } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// router for deleting user account
router.delete("/deleteProfile", auth, deleteAccount)

// router for updating user profile
router.put("/updateProfile", auth, updateProfile)

// router for getting user details
router.get("/getUserDetails", auth, getAllUserDetails)

// router for getting all enrolled course of user
router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses)


router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

// router for updating  profile picture of user
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router