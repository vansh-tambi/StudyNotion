const Section = require("../models/Section");
const Course = require("../models/Course");

// controller for CREATING a new section
exports.createSection = async (req, res) => {
	try {
		// extract required data from the req body
		const { sectionName, courseId } = req.body;

		// validate data
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
		.populate({
			path: "courseContent",
			populate: {
				path: "subSection",
			},
		})
		.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// controller for UPDATING a section
exports.updateSection = async (req, res) => {
	try {
		// fetch required data from req body
		const { sectionName, sectionId, courseId } = req.body;

		// find and update section
		await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path: "courseContent",
			populate: {
				path: "subSection",
			},
		});

		res.status(200).json({
			success: true,
			message: "Section updated successfully",
			data: course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// controller for DELETING a section
exports.deleteSection = async (req, res) => {
	try {
		// fetch data from req body
		const { sectionId, courseId } = req.body;

		// search and delete section
		await Section.findByIdAndDelete(sectionId);

		// delete section from course
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId, 
			{$pull: {courseContent: sectionId}},
			{new: true},
		).populate({
			path: "courseContent",
			populate: {
				path: "subSection",
			},
		}).exec();

		// return response
		res.status(200).json({
			success: true,
			message: "Section deleted",
			data: updatedCourse,
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};