const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require('../models/SubSection');
const User = require("../models/User");
const CourseProgress = require('../models/CourseProgress');
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");

// controller for creating a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}

		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});
		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the given category is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

		// Upload the Thumbnail image to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);

		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);

		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);

		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.editCourse = async (req, res) => {
	try {
		const {courseId} = req.body;
		const updates = req.body;
		const course = await Course.findById(courseId);

		if(!course) {
			return res.status(404).json({error: "Course not found"});
		}

		// If thumbnail image is found, update it
		if(req.files) {
			console.log("thumbnail updating");
			const thumbnail = req.files.thumbnailImage;
			const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

			// add thumbnail field to course object (will be used to save data in db)
			course.thumbnail = thumbnailImage.secure_url;
		}

		// update only the fields that are present in the request body
		for (const key in updates) {
			if(updates.hasOwnProperty(key)) {
				if(key === "tag" || key === "instructions") {
					course[key] = JSON.parse(updates[key]);
				} else {
					course[key] = updates[key];
				}
			}
		}

		// save the course in db
		await course.save();

		const updatedCourse = await Course.findOne({
			_id: courseId,
		})
		.populate({
			path: "instructor",
			populate: {
				path: "additionalDetails",
			},
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
			path: "courseContent",
			popoulate: {
				path: "subSection",
			},
		})
		.exec();

		return res.status(200).json({
			success: true,
			message: 'Course updated successfully',
			data: updatedCourse,
		});
	} catch(err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
}

// get all published courses
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{ status: "Published" },
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
			}
		).populate("instructor").exec();
		
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//controller for getting a course details
exports.getCourseDetails = async (req, res) => {
    try {
		//get course id
		const {courseId} = req.body;

		if(!courseId) {
			return res.status(200).json({
				success: false,
				message: "Please provide a course ID",
			});
		}

		//find course details and populate all 
		const courseDetails = await Course.findById(courseId)
			.populate({
					path:"instructor",
					populate:{
						path:"additionalDetails",
						model: "Profile"
					},
				})
			.populate("category")
			.populate({
				path: "ratingAndReviews",
			})
			.populate({
				path:"courseContent",
				populate:{
					path:"subSection",
					model: "SubSection"
				},
			})
			.exec();

			//validation
			if(!courseDetails) {
				return res.status(400).json({
					success:false,
					message:`Could not find the course with ${courseId}`,
				});
			}

			//return response
			return res.status(200).json({
				success:true,
				message:"Course Details fetched successfully",
				data:courseDetails,
			})

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {
	try {
		const {courseId} = req.body;
		const userId = req.user.id;

		const courseDetails = await Course.findOne({
			_id: courseId,
		})
		.populate({
			path: "instructor",
			populate: {
				path: "additionalDetails",
			}
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
			path: "courseContent",
			populate: {
				path: "subSection",
			}
		})
		.exec();

		let courseProgressCount = await CourseProgress.findOne({
			courseID: courseId,
			userId: userId,
		});

		console.log("courseProgressCount: ", courseProgressCount);

		if(!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find the course with id: ${courseId}`,
			})
		}

		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration);
				totalDurationInSeconds += timeDurationInSeconds;
			})
		});

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos 
								 ? courseProgressCount?.completedVideos
								 : [],
			},	
		});
	} catch(err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			err: err.message,
		});
	}
}

exports.getInstructorCourses = async (req, res) => {
	try {
		const instructorId = req.user.id;

		const instructorCourses = await Course.find({
			instructor: instructorId,
		})
		.sort({createdAt: -1})
		.populate({
			path: 'courseContent',
			populate: {
				path: 'subSection',
			}
		})
		.exec();

		return res.status(200).json({
			success: true,
			message: "Instructor's all course fetched successfully",
			data: instructorCourses,
		})
	} catch(err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message,
		});
	}
}

exports.deleteCourse = async (req, res) => {
	try {
		const {courseId} = req.body;

		const course = await Course.findById(courseId);
		if(!course) {
			return res.status(400).json({
				success: false,
				message: 'Course not found',
			});
		}

		// Unenroll students from the course
		const studentsEnrolled = course.studentsEnrolled;
		for(const studentId of studentsEnrolled) {
			await User.findByIdAndUpdate(studentId, {
				$pull: { courses: courseId },
			});
		}
		
		// Delete sections and sub-sections
		const courseSections = course.courseContent;
		for(const sectionId of courseSections) {
			// delete sub-sections of the section
			const section = await Section.findById(sectionId);
			if(section) {
				const subSection = section.subSection;
				for(const subSectionId of subSection) {
					await SubSection.findByIdAndDelete(subSectionId);
				}
			}

			// delete the section
			await Section.findByIdAndDelete(sectionId);
		}

		// delete the course
		await Course.findByIdAndDelete(courseId);

		return res.status(200).json({
			success: true,
			message: 'Course deleted successfully',
		});
	} catch(err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message,
		});
	}
}

