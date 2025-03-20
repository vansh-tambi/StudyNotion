import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

import { IconBtn } from '../../common/IconBtn';

export const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStaus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();

    const {sectionId, subSectionId} = useParams();

    const {
        courseSectionData,
        courseEntireData,
        completedLectures,
        totalNoOfLectures
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        // define and call the function
        // no need to explicitly call using this syntax
        ;(() => {
            if(!courseSectionData.length) return;

            const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);


            const activeSectionId = courseSectionData?.[currentSectionIndex]?._id;
            const activeSubSectionId = courseSectionData[currentSectionIndex].subSection?.[currentSubSectionIndex]?._id;

            // set current section
            setActiveStaus(activeSectionId);
            // set current sub-section
            setVideoBarActive(activeSubSectionId);

            // console.log("Logging courseSection data:....", courseSectionData);
            // console.log("logging course entire data:...", courseEntireData);
            // console.log("logging completed lectures:...", completedLectures);
            // console.log("logging total no of lectures:...", totalNoOfLectures);
        })()
    },[courseSectionData, courseEntireData, location.pathname]);

    const goToVideo = (sectionId, subSectionId) => {
        navigate(`/view-course/${courseEntireData?._id}/section/${sectionId}/sub-section/${subSectionId}`);
        setVideoBarActive(subSectionId);
    }

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">

            {/* buttons & headings */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* buttons */}
                <div className="flex w-full items-center justify-between ">
                    <button
                        onClick={() => navigate('/dashboard/enrolled-courses')}
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                        title="back"
                    >
                        <IoIosArrowBack size={30} />
                    </button>

                    <div>
                        <IconBtn
                            text="Add Review"
                            onClick={() => setReviewModal(true)}
                        />
                    </div>
                </div>

                {/* headings */}
                <div className="flex flex-col">
                    <p>{courseEntireData?.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">
                        {completedLectures?.length} / {totalNoOfLectures}
                    </p>
                </div>
            </div>

            {/* sections and sub-sections */}
            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((section) => (
                        <div 
                            key={section._id}
                            onClick={(() => setActiveStaus(section._id))}
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                        >

                            {/* section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {section?.sectionName}
                                </div>

                                {/* arrow down icon */}
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`${
                                        activeStatus === section?._id
                                            ? "rotate-0"
                                            : "rotate-180"
                                        } duration-[0.35s] ease-[ease]`}
                                    >
                                        <BsChevronDown />
                                    </span>
                                </div>
                            </div>

                            {/* sub-sections */}
                            {
                                activeStatus === section._id && (
                                    <div className="transition-[height] duration-500 ease-in-out">
                                        {
                                            section.subSection.map((subSection) => (
                                                <div 
                                                    key={subSection._id}
                                                    className={`flex gap-3 px-5 py-2 
                                                    ${videoBarActive === subSection._id 
                                                    ? 'bg-yellow-200 font-semibold text-richblack-800' 
                                                    : 'hover:bg-richblack-900'}
                                                    `}
                                                    onClick={() => goToVideo(section._id, subSection._id)}
                                                >
                                                        <input
                                                            type='checkbox'
                                                            checked={completedLectures.includes(subSection._id)}
                                                            onChange={() => {}}
                                                            className='pointer-events-none'
                                                        />
                                                        <span>{subSection.title}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}
