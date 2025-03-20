import React from 'react'

export const Card = ({course}) => {
  return (
    <div className="w-full md:w-1/3">
        <img
            src={course.thumbnail}
            alt={course.courseName}
            className='h-[201px] w-full rounded-md object-cover'
        />
        
        <div className="mt-3 w-full">
            <p className="text-sm font-medium text-richblack-50">
              {course.courseName}
            </p>

            <div className="mt-1 flex items-center space-x-2">
                <p className="text-xs font-medium text-richblack-300">
                  {course.studentsEnrolled.length} students
                </p>

                <p className="text-xs font-medium text-richblack-300">
                  |
                </p>

                <p className="text-xs font-medium text-richblack-300">
                  Rs.{course.price}
                </p>
            </div>
        </div>
    </div>
  )
}
