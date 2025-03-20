import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

import {
  setCourseSectionData, 
  setCourseEntireData, 
  setCompletedLectures, 
  setTotalNoOfLectures
} from '../slices/viewCourseSlice';

import {getFullDetailsOfCourse} from '../services/operations/courseDetailsAPI';
import { VideoDetailsSidebar } from '../components/core/ViewCourse/VideoDetailsSidebar';
import { CourseReviewModal } from '../components/core/ViewCourse/CourseReviewModal';

import '../components/common/loader.css';

export const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const {courseId} = useParams();

    const {token} = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
      const setCourseSpecificDetails = async () => {
        setLoading(true);

        const courseData = await getFullDetailsOfCourse(courseId, token);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        dispatch(setCourseEntireData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));

        let lectures = 0;
        courseData?.courseDetails?.courseContent?.forEach((section) => {
          lectures += section.subSection.length;
        });
        dispatch(setTotalNoOfLectures(lectures));

        setLoading(false);
      }

      setCourseSpecificDetails();
    }, []);


  if(loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <div className='loader'></div>
      </div>
    )
  }

  return (
    <>
      <div className='relative flex min-h[calc(100vh-3.5rem)]'>
          <VideoDetailsSidebar setReviewModal={setReviewModal}/>

          <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
              <div className='mx-6'>
                  <Outlet/>
              </div>
          </div>

          {
            reviewModal && (
              <CourseReviewModal setReviewModal={setReviewModal}/>
            )
          }
      </div>
    </>
  )
}
