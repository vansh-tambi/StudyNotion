import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ProgressBar from '@ramonak/react-progress-bar';

import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';

import '../../common/loader.css';
import { useNavigate } from 'react-router-dom';

function EnrolledCourses() {
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
           const response = await getUserEnrolledCourses(token);
           setEnrolledCourses(response);
        } catch(err) {
            console.log('Error while fetching enrolled courses...', err);
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    }, []);

  return (
    <>
        <h2 className="text-3xl text-richblack-50">Enrolled Courses</h2>
        {
            !enrolledCourses ? (
                // loader
                <div className='loader absolute top-1/2 left-1/2'></div>
            )
            : !enrolledCourses.length ? (
                <p className="grid h-[10vh] text-lg mt-10 w-full text-richblack-500">
                    You have not enrolled in any course yet.
                    <br/>
                    Please visit Catalog.
                </p>
            )
            : (
                <div className="my-8 text-richblack-5">
                    {/* headings */}
                    <div className="flex rounded-t-lg bg-richblack-700">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Duration</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    
                    {/* courses */}
                    {
                        enrolledCourses.map((course, index, arr) => (
                            <div 
                                key={index}
                                className={`flex items-center border border-richblack-700 ${
                                index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`}
                            >
                                <div
                                    className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                    onClick={() => {
                                        // console.log("logging clicked course details...",course)
                                        navigate(
                                            `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                        )
                                    }}
                                >
                                    <img 
                                        src={course?.thumbnail}
                                        alt="thumbnail image"
                                        className="h-14 w-14 rounded-lg object-cover"
                                    />

                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course?.courseName}</p>
                                        {/* display max 50 characters of description */}
                                        <p className="text-xs text-richblack-300">
                                            {course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)}...`
                                            : course.courseDescription}
                                        </p>
                                    </div>

                                </div>

                                <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                                
                                {/* progress-bar */}
                                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                    <p>Progress: {course.progressPercentage || 0}</p>
                                    <ProgressBar
                                        completed={course.progressPercentage || 0}
                                        height='8px'
                                        isLabelVisible={false}
                                    />
                                </div>

                            </div>
                        ))
                    }
                </div>
            )
        }
    </>
  )
}

export default EnrolledCourses