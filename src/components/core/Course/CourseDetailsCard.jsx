import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';

import { IconBtn } from '../../common/IconBtn';

import { MdKeyboardArrowRight } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";


export const CourseDetailsCard = ({course, handleBuyCourse, handleAddToCart}) => {


    const {
        thumbnail: thumbnailImage,
        price: currentPrice,
    } = course;

    const {user} = useSelector((state) => state.profile);

    const navigate = useNavigate();

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Linked copied to clipboard");
    }

  return (
    <>
        <div className='flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5'>
            {/* Course Image */}
            <img
                src={thumbnailImage}
                alt='thumbnail image'
                className='max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full'
            />

            <div className="px-4">
                {/* price */}
                <div className="space-x-3 pb-4 text-3xl font-semibold">
                    Rs. {currentPrice}
                </div>
                
                {/* buttons */}
                <div className="flex flex-col gap-4">
                    <IconBtn
                        text={user && course.studentsEnrolled.includes(user?._id) 
                            ? "Go to Course"
                            : "Buy Now"}
                        onClick={user && course.studentsEnrolled.includes(user?._id)
                            ? () => navigate('/dashboard/enrolled-courses')
                            : handleBuyCourse}
                    />
                    
                    {
                        !course?.studentsEnrolled.includes(user?._id) && (
                            <button
                                className='blackButton hover:bg-richblack-900 transition-all duration-200'
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        )
                    }
                </div>
                
                {/* money back gurantee */}
                <div>
                    <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                        30-Day Money-Back Gurantee
                    </p>
                </div>

                {/* course instructions */}
                <div>
                    <p className='my-2 text-xl font-semibold'>
                        This Course Includes :
                    </p>
                    
                    <div className='flex flex-col gap-3 text-sm text-caribbeangreen-100'>
                        {
                            course?.instructions?.map((item, index) => (
                                <p key={index} className='flex gap-x-2 items-center'>
                                    <MdKeyboardArrowRight size={18}/>
                                    <span>{item}</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
                
                {/* share course */}
                <div className='text-center'>
                    <button
                        onClick={handleShare}
                        className='mx-auto flex items-center gap-2 p-6 text-yellow-100'
                    >
                        <FaShareSquare size={15}/>
                        Share
                    </button>
                </div>
            </div>

        </div>
    </>
  )
}
