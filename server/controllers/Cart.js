const Cart = require('../models/Cart');
const Course = require('../models/Course');
const { mongo, default: mongoose } = require("mongoose");

// adds an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const {cartId, courseId} = req.body;

        if(!cartId || !courseId) {
            return res.status(409).json({
                success: false,
                message: 'Please provide all details',
            });
        }

        // validate course
        const courseDetails = await Course.findById(courseId);
        
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // search cart
        const cartDetails = await Cart.findById(cartId);

        if(!cartDetails) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const course_id = new mongoose.Types.ObjectId(courseId);
        // check if course already added in cart
        if(cartDetails.courses.includes(course_id)) {
            return res.status(409).json({
                success: false,
                message: "Course already added to the cart",
            });
        }

        // add new course to the cart
        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            {$push: {courses: courseId}},
            {new: true}
        ).populate("courses");  

        // return response
        return res.status(200).json({
            success: true,
            message: "Course added to cart successfully",
            data: updatedCart,
        })
    } catch(err) {
        console.log("error in ADD TO CART BACKEND...", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

// remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const {cartId, courseId} = req.body;

        if(!cartId || !courseId) {
            return res.status(409).json({
                success: false,
                message: "All fields are required",
            });
        }

        // search course
        const courseDetails = await Course.findById(courseId);

        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const cartDetails = await Cart.findById(cartId);

        if(!cartDetails) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        // check if course is not present in cart
        const course_id = new mongoose.Types.ObjectId(courseId);

        if(!cartDetails.courses.includes(course_id)) {
            return res.status(404).json({
                success: false,
                message: "Course is not present in the cart",
            });
        }

        // remove course from cart
        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            {$pull: {courses: courseId}},
            {new: true},
        ).populate("courses");  

        // return response
        return res.status(200).json({
            success: true,
            message: "Course removed from cart",
            data: updatedCart,
        });
    } catch(err) {
        console.log("error in REMOVE FROM CART BACKEND...", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

// get full details
exports.getFullCartDetails = async (req, res) => {
    try {
        const {cartId} = req.body;

        if(!cartId) {
            return res.status(409).json({
                success: false,
                message: "Please provide cart ID",
            });
        }

        // find cart and populate all details
        const cartDetails = await Cart.findById(cartId)
        .populate({
            path: "courses",
            populate: [
                { path: "instructor", populate: { path: "additionalDetails" } },
                { path: "category" },
                { path: "ratingAndReviews" },
                { 
                    path: "courseContent",
                    populate: { path: "subSection" },
                },
            ],
        })
        .exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "Cart details fetched successfully",
            data: cartDetails,
        });
    } catch(err) {
        console.log("GET FULL CART DETAILS BACKEND error....", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}