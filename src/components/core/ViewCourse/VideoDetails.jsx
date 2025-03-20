import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BigPlayButton, Player } from 'video-react';
import 'video-react/dist/video-react.css';

import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';

import { IconBtn } from '../../common/IconBtn';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';

export const VideoDetails = () => {

    const {courseId, sectionId, subSectionId} = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerRef = useRef();
    const location = useLocation();

    const {token} = useSelector((state) => state.auth);
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse);

    const [previewSource, setPreviewSource] = useState('');
    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        const setVideoSpecificDetails = () => {
            if(!courseSectionData.length) return;

            if(!courseId && !sectionId && !subSectionId) {
                navigate("/dashboard/enrolled-courses");
            }
            else {
                // get section data
                const fileterdData = courseSectionData?.filter((section) => section._id === sectionId);

                // get video data
                const filteredVideoData = fileterdData?.[0]?.subSection.filter((subSection) => subSection._id === subSectionId);
                
                setPreviewSource(courseEntireData.thumbnail);
                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        }   

        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname]);

    // check if the current video is the first video of section
    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);

        if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        } else {
            return false;
        }
    }

    // check if the current video is the last video of section
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);

        const noOfSubSections = courseSectionData?.[currentSectionIndex]?.subSection.length;

        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);

        if(currentSectionIndex === courseSectionData.length - 1 && 
            currentSubSectionIndex === noOfSubSections - 1) {
                return true;
        } else {
                return false;
        }
    }

    const goToPreviousVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);

        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);

        // go to previous video of same section
        if(currentSubSectionIndex !== 0) {
            const previousSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex - 1]?._id;

             // navigate to this video
             navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`);
        } 
        // go to first video of previous section
        else {
            const previousSectionId = courseSectionData?.[currentSectionIndex - 1]._id;
            const previousSubSectionLength = courseSectionData?.[currentSectionIndex - 1]?.subSection.length;
            const previousSubSectionId = courseSectionData?.[currentSectionIndex - 1]?.subSection[previousSubSectionLength - 1]?._id;

            // navigate to this video
            navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
        }
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);

        const noOfSubSections = courseSectionData?.[currentSectionIndex]?.subSection.length;

        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);

        // go to next video of same section
        if(currentSubSectionIndex !== noOfSubSections - 1) {
            const nextSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex + 1]?._id;

            // navigate to this video
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } 
        // go to first video of next section
        else {
            const nextSectionId = courseSectionData?.[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData?.[currentSectionIndex + 1]?.subSection?.[0]?._id;

            // navigate to this video
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    }

    const hadleLectureCompletion = async () => {
        setLoading(true);

        const result = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);

        // update state in slice
        if(result) {
            dispatch(updateCompletedLectures(subSectionId));
        }

        setLoading(false);
    }

  return (
    <div className="flex flex-col gap-5 text-white">
        {
            !videoData ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                <Player
                    ref={playerRef}
                    aspectRatio='16:9'
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >
                    {/* Play icon */}
                    <BigPlayButton position='center'/>

                    {
                        videoEnded && (
                            <div
                                style={{
                                    backgroundImage:
                                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                }}
                                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                            >
                                {
                                    // complete button
                                    !completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                            disabled={loading}
                                            onClick={hadleLectureCompletion}
                                            text={!loading ? "Mark as Completed" : "Loading..."}
                                            customClasses="text-xl max-w-max px-4 mx-auto bg-yellow-50 text-richblack-900 font-semibold"
                                        />
                                    )
                                }
                                
                                {/* re-watch button */}
                                <IconBtn
                                    disabled={loading}
                                    text="Rewatch"
                                    onClick={() => {
                                        playerRef?.current?.seek(0);
                                        playerRef?.current?.play();
                                        setVideoEnded(false);
                                    }}
                                    customClasses="text-xl max-w-max px-4 mx-auto mt-2 bg-yellow-50 text-richblack-900 font-semibold"
                                />

                                {/* previous & next buttons */}
                                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                    {/* previous */}
                                    {
                                        !isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToPreviousVideo}
                                                className='blackButton hover:bg-richblack-900 duration-200'
                                            >
                                                Prev  
                                            </button>
                                        )
                                    }
                                    {/* next */}
                                    {
                                        !isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className='blackButton hover:bg-richblack-900 duration-200'
                                            >
                                                Next
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </Player>
            )
        }

        <h1 className="mt-4 text-3xl font-semibold">
            {videoData?.title}
        </h1>
        <p className="pt-2 pb-6">
            {videoData?.description}
        </p>
    </div>
  )
}
