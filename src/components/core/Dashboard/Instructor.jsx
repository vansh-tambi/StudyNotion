import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import "../../common/loader.css"

import { getInstructorData } from '../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import { InstructorChart } from './InstructorDashboard/InstructorChart';
import { Link } from 'react-router-dom';
import { Card } from './InstructorDashboard/Card';

export const Instructor = () => {

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
  const [totalAmountGenerated, setTotalAmountGenerated] = useState(0);

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);

      // API call
      const instructorDataApiResult = await getInstructorData(token);
      const instructorCoursesData = await fetchInstructorCourses(token);

      // set states
      if(instructorDataApiResult) {
        setInstructorData(instructorDataApiResult.courses);
        setTotalStudentsEnrolled(instructorDataApiResult.totalStudentsEnrolled);
        setTotalAmountGenerated(instructorDataApiResult.totalAmountGenerated);
      }

      if(instructorCoursesData?.length) {
        setCoursesData(instructorCoursesData);
      }

      setLoading(false);
    }

    getCourseDataWithStats();
  }, []);

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">Hi {user?.firstName} 👋</h1>
        <p className="font-medium text-richblack-200">Let's start something new</p>
      </div>

      {
        loading 
        ? (<div className='loader absolute top-1/2 left-1/2'></div>)
        : (
          coursesData?.length > 0 
          ? (
            <div>
              {/* pie-chart & statistics */}
              <div className="my-4 flex space-x-4">
                {/* pie-chart */}
                  {
                    totalAmountGenerated > 0 || totalStudentsEnrolled > 0 
                    ? (
                        <InstructorChart instructorData={instructorData}/>
                    ) : (
                      <div className='flex-1 rounded-md bg-richblack-800 p-6'>
                        <p className="text-lg font-bold text-richblack-5">Visualize</p>
                        <p className="mt-4 text-xl font-medium text-richblack-50">
                          Not Enough Data To Visualize
                        </p>
                      </div>
                    )
                  }

                {/* Statistics */}
                <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Statistics</p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-lg text-richblack-200">Total Courses</p>
                      <p className="text-3xl font-semibold text-richblack-50">{coursesData.length}</p>
                    </div>

                    <div>
                      <p className="text-lg text-richblack-200">Total Students</p>
                      <p className="text-3xl font-semibold text-richblack-50">{totalStudentsEnrolled}</p>
                    </div>

                    <div>
                      <p className="text-lg text-richblack-200">Total Income</p>
                      <p className="text-3xl font-semibold text-richblack-50">{totalAmountGenerated}</p>
                    </div>

                  </div>

                </div>
                
              </div>

                {/* Render 3 courses */}
                <div className="rounded-md bg-richblack-800 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-richblack-5">Your courses</p>

                    <Link to="/dashboard/my-courses">
                      <p className="text-xs font-semibold text-yellow-50">View all</p>
                    </Link>
                  </div>

                  <div className="my-4 flex flex-col md:flex-row items-start space-x-6">
                    {
                      coursesData.slice(0, 3).map((course) => (
                        <Card key={course._id} course={course}/>
                      ))
                    }
                  </div>
                </div>

            </div>

          )
          : (
            <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
              <p className="text-center text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
              <Link to="/dashboard/add-course">
                <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                  Create a course
                </p>
              </Link>
            </div>
          )
        )
      }
    </div>
  )
}
