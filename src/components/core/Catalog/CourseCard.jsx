import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import RatingStars from '../../common/RatingStars'
import GetAverageRating from '../../../utils/avgRating'

export const CourseCard = ({course, Height}) => {

    const [averageReviewCount, setAverageReviewCount] = useState(0);

    useEffect(() => {
        const count = GetAverageRating(course?.ratingAndReviews);
        setAverageReviewCount(count);
    }, [course]);

  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div className="rounded-lg">
                <img 
                    src={course?.thumbnail}
                    alt={course?.courseName}    
                    className={`${Height} w-full rounded-xl object-cover`}
                />
            </div>

            <div className="flex flex-col gap-2 px-1 py-3">
                <p className="text-xl text-richblack-5">
                    {course?.courseName}
                </p>

                <p className="text-sm text-richblack-50">
                    {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
                
                <div className="flex items-center gap-2">
                    <span className="text-yellow-5">
                        {averageReviewCount || 0}
                    </span>
                    
                    <RatingStars Review_Count={averageReviewCount}/>

                    <span className="text-richblack-400">
                        {course?.ratingAndReviews?.length} Ratings
                    </span>
                </div>

                <p className="text-xl text-richblack-5">₹ {course?.price}</p>
            </div>
        </Link>
    </div>
  )
}
