const Category = require("../models/Category");
const Course = require("../models/Course");

// returns random number between [0 to n-1]
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// create category controller
exports.createCategory = async (req, res) => {
	try {
        // fetch data
		const { name, description } = req.body;

        // validate data
		if (!name) {
			return res.status(400).json(
                { 
                    success: false, 
                    message: "All fields are required" 
                });
		}

        // check if category already exists
        const categoryFind = await Category.findOne({name:name});
        if(categoryFind) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists',
            });
        }

        // create category
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
        
        // return success response
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

// show all categories controller
exports.showAllCategories = async (req, res) => {
	try {
		const allCategories = await Category.find(
			{},
			{ name: true, description: true }
		);

		res.status(200).json({
			success: true,
			data: allCategories,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// categoryPageDetails 
exports.categoryPageDetails = async (req, res) => {
    try {
            const {categoryId} = req.body;

            // get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                .populate({
                    path: 'courses',
                    match: {status: 'Published'},
                    populate: "ratingAndReviews"
                })
                .exec();

            // validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Category Not Found',
                });
            }

            // when there are no courses
            // if(selectedCategory.courses.length === 0) {
            //     console.log("No course found for the selected category");
            //     return res.status(404).json({
            //         success: false,
            //         message: 'No courses found for the selected category',
            //     });
            // }

            // get other categories
            const categoriesExceptSelected = await Category.find(
                { _id: {$ne: categoryId} // not equals to
            }) 

            // get all published course of a random other category
            let differentCategories = await Category.findOne(
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
            )
                .populate({
                    path: "courses",
                    match: {status: "Published"},
                })
                .exec();

            // get top 10 selling courses
            const allCategories = await Category.find()
                .populate({
                    path: "courses",
                    match: {status: "Published"},
                    populate: {
                        path: "instructor",
                    },
                })
                .exec();

            const allCourses = allCategories.flatMap((category) => category.courses);
            const mostSellingCourses = allCourses
                                       .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
                                       .slice(0, 10);

            // return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                    mostSellingCourses,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error:error.message,
        });
    }
}