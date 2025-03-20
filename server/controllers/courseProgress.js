const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
    try {
        const {courseId, subSectionId} = req.body;
        const userId = req.user.id;

        // check if sub-section is valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        // check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        if(!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress not found",
            });
        }

        // check if sub-section already completed
        if(courseProgress.completedVideos.includes(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "Sub-section already completed",
            });
        }

        // add sub-section to completed
        courseProgress.completedVideos.push(subSectionId);

        // save in db
        await courseProgress.save();

        // return response
        return res.status(200).json({
            success: true,
            message: 'Lecture completed',
        });
    } catch(err) {
        console.error("UPDATE COURSE PROGRESS backend error...", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}