const {instance} = require("../config/razorpay");

const Course = require("../models/Course");
const User = require("../models/User");

const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessfulEmail } = require("../mail/templates/paymentSuccessfulEmail");

const { default: mongoose } = require("mongoose");
const crypto = require('crypto');
const CourseProgress = require("../models/CourseProgress");

// initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    // no courses to buy
    if(courses.length === 0) {
        return res.json({
            success: false,
            message: 'No courses to buy, Please provide course ID',
        });
    }

    // calculate total Amount
    let totalAmount = 0;
    for(const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            const uId = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uId)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled",
                });
            }

            totalAmount += course.price;
        } catch(err) {
            console.log('ERROR while calculating total amount IN CAPTURE PAYMENT backend API....', err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                err: err.message,
            });
        }
    }

    // create order
    const options = {
        amount: totalAmount*100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: paymentResponse,
        });
    } catch(err) {
        console.log('ERROR while creating order IN CAPTURE PAYMENT backend API....', err)
        res.status(500).json({
            success: false,
            message: 'Could not initiate order',
            err: err.message,
        });
    }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    
    const courses = req.body?.courses;
    const userId = req.user.id;

    if( !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId ) {
        return res.status(200).json({
            success: false,
            message: 'Payment failed',
            err: 'All fileds are required',
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature) {
        // enroll the student in purchased course/s
        await enrolledStudents(courses, userId, res)

        // return response
        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
        });
    }
    else {
        return res.status(200).json({
            success: false,
            message: 'Payment failed',
            error: 'Failed to verify signature',
        });
    }
}

const enrolledStudents = async(courses, userId, res) => {
    if(!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide data for courses and userId',
        });
    }

    try {
        for(const courseId of courses) {
            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled:userId}},
                {new:true},
            );
    
            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            // create course progress for student
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });
    
            // find the student and add the course & course progress to their list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {
                    courses:courseId,
                    courseProgress:courseProgress._id,
                }},
                {new: true},
            );
    
            if(!enrolledStudent) {
                return res.status(500).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // send enroll successful mail to student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`),
            );
    
            console.log("course enrolled email response...", emailResponse);
        }
    } catch(err) {
        console.log("error while enrolling student IN VERIFY PAYMENT API....", err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message,
        })
    }
}

// send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: 'All fileds are required',
        });
    }

    try {
        // find the student and send the mail
        const enrolledStudent = await User.findById(userId);
        
        // send payment succesful email
        await mailSender(
            enrolledStudent.email,
            "Payment received",
            paymentSuccessfulEmail(`${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount/100, orderId, paymentId)
            );       
    } catch(err) {
        console.log("error in sending PAYMENT SUCCESSFULL EMAIL API....", err);
        return res.status(500).json({
            success: false,
            message: 'Could not send payment success email',
            error: err.message,
        });
    }
}




/*
        Below code works only for buying a single course
        can not buy more than 1 course at a time
*/



// capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
    
//     // validate courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };

//     // validate courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         // if user has already paid for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
    
//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         // initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
    

// };

// // verify Signature of Razorpay and Server
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
//             // fulfil the action

//             // find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id: courseId},
//                 {$push:{studentsEnrolled: userId}},
//                 {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not Found',
//                 });
//             }

//             console.log(enrolledCourse);

//             // find the student and add the course to their list of enrolled courses 
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id:userId},
//                 {$push:{courses:courseId}},
//                 {new:true},
//             );

//             console.log(enrolledStudent);

//             // send confirmation mail
//             const emailResponse = await mailSender(
//                                     enrolledStudent.email,
//                                     "Congratulations from StudyNotion",
//                                     courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`),
//             );

//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified and COurse Added",
//             });
//         }       
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }
// };