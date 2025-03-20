import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';

import '../components/common/loader.css';

import { buyCourse } from '../services/operations/studentFeaturesAPI';
import {fetchCourseDetails} from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating'
import RatingStars from '../components/common/RatingStars'
import { addItemToCart } from '../services/operations/cartAPI';
import {ACCOUNT_TYPE} from '../utils/constants';

import {formatDate} from '../services/formatDate';
import {convertSecondsToDuration} from '../utils/secondsToDuration';

import { addToCart } from '../slices/cartSlice';

import {ConfirmationModal} from '../components/common/ConfirmationModal'
import { CourseDetailsCard } from '../components/core/Course/CourseDetailsCard';
import Footer from '../components/common/Footer';

import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import Markdown from 'react-markdown'
import toast from 'react-hot-toast';
import { CourseAccordionBar } from '../components/core/Course/CourseAccordionBar';

export const CourseDetails = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {loading} = useSelector((state) => state.profile);
    const {paymentLoading} = useSelector((state) => state.course);

    const {courseId} = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [confirmationModal, setConfirmationModal] = useState(null);

    // get course data
    const [courseData, setCourseData] = useState(null);
    useEffect(() => {
        const getCourseFullDetails = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                if(result) {
                    // console.log("Logging result:...", result);
                    setCourseData(result);
                }
            } catch(err) {
                console.log("Could not fetch couse details");
            }
        }
        
        if(courseId) {
            getCourseFullDetails();
        }
    }, [courseId]);
    
    // get average review count
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = GetAvgRating(courseData?.ratingAndReviews);
        setAvgReviewCount(count);
    }, [courseData]);

    // get total number of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        courseData?.courseContent?.forEach((section) => {
            lectures += section.subSection.length || 0;
        });

        setTotalNoOfLectures(lectures);
    }, [courseData]);


    // get total time duration of course
    const [totalDuration, setTotalDuration] = useState(0);
    useEffect(() => {
        const totalSeconds = courseData?.courseContent?.reduce((total, sectionObj) => {
            return total + sectionObj.subSection.reduce((subTotal, subSection) => {
                return subTotal + Number.parseFloat(subSection.timeDuration);
            }, 0);
        }, 0);
        

        const totalTime = convertSecondsToDuration(Number.parseInt(totalSeconds));
        setTotalDuration(totalTime);
    }, [courseData]);

    // show and hide course Accordion
    const [isActive, setIsActive] = useState(Array(0));
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e !== id)
        )
    }

    const handleBuyCourse = async () => {
        if(token) {
            // check if instructor is trying to buy
            if(user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                toast.error("You are an Instructor, you can't buy a course");
                return;
            }

            const buyingFromCatalogPage = true;
            await buyCourse([courseId], token, user, navigate, dispatch, buyingFromCatalogPage);
            return;
        }

        // user is not logged in
        setConfirmationModal({
            text1: "You are not logged in halwa",
            text2: "Please login to purchase the course",
            btn1Text:"Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate('/login'),
            btn2Handler: () => setConfirmationModal(null),
        });
    }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent, 
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData ? courseData : [];

  const handleAddToCart = async () => {
    if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
        toast.error("You are an Instructor, you can't buy a course");
        return;
    }

    if(token) {
        const cartId = user?.cart;
        await addItemToCart(cartId, course_id, token);
            
        dispatch(addToCart(courseData));
        return;
    }

    setConfirmationModal({
        text1: "You are not logged in",
        text2: "Please login to purchase the course",
        btn1Text:"Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate('/login'),
        btn2Handler: () => setConfirmationModal(null),
    });
}


  if(loading || paymentLoading || !courseData) {
    return (
        <div className='h-screen w-screen relative'>
            <div className='loader absolute top-1/2 left-1/2'></div>
        </div>
    )
  }

  return (
    <>
        {/* Hero section */}
        <div className='relative w-full bg-richblack-800'>
            {/* course description & card */}
            <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
                
                {/* course description & rating & card for smaller screen*/}
                <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">

                    {/* for smaller screens*/}
                    {/* thumbnail */}
                    <div className="relative block max-h-[30rem] lg:hidden">
                        {/* shadow */}
                        <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                        
                        <img
                            src={thumbnail}
                            alt='course thumbnail'
                            className='max-h-full'
                        />
                    </div>

                    {/* course description & rating */}
                    <div className='z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5'>
                        <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                            {courseName}
                        </p>

                        <p className='text-richblack-200'>
                            {courseDescription}
                        </p>

                        <div className="text-md flex flex-wrap items-center gap-2">
                            <span className="text-yellow-25">{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                            <span>{`${ratingAndReviews.length} reviews`}</span>
                            <span>{`${studentsEnrolled.length} students enrolled`}</span>
                        </div>

                        <div>   
                            <p>
                                Created by {`${instructor.firstName} ${instructor.lastName}`}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5 text-lg">
                            <p className="flex items-center gap-2">
                                {" "}
                                <BiInfoCircle /> Created at {formatDate(createdAt)}
                            </p>
                            <p className="flex items-center gap-2">
                                {" "}
                                <HiOutlineGlobeAlt /> English
                            </p>
                        </div>
                    </div>

                    {/* for smaller screens */}
                    {/* buy & add to cart buttons */}
                    <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                        <p className='space-x-3 pb-4 text-3xl font-semibold text-richblack-5'>
                            Rs. {price}
                        </p>

                        <button
                            className="yellowButton"
                            onClick={handleBuyCourse}
                        >   
                            Buy Now
                        </button>

                        <button 
                            className="blackButton"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
                

                {/* Course-card for large screens*/}
                <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                    <CourseDetailsCard
                        course={courseData}
                        handleBuyCourse={handleBuyCourse}
                        handleAddToCart={handleAddToCart}
                    />
                </div>

            </div>
            
        </div>

        {/* Accordion */}
        <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">

                {/* what you will learn section */}
                <div className='my-8 border border-richblack-600 p-8'>
                    <p className="text-3xl font-semibold">What you'll learn</p>

                    <div className='mt-5'>
                        <Markdown>
                            {whatYouWillLearn}
                        </Markdown>
                    </div>
                </div>
                
                {/* course content section */}
                <div className="max-w-[830px]">

                    <div className="flex flex-col gap-3">
                        <p className="text-[28px] font-semibold">Course Content:</p>
                        
                        <div className="flex flex-wrap justify-between gap-2">
                            <div className='flex gap-2'>
                                <span>{courseContent.length} {`section(s)`}</span>

                                <span>{totalNoOfLectures} {`lecture(s)`}</span>

                                <span>{totalDuration} total length</span>
                            </div>

                            <div>
                                <button 
                                    className='text-yellow-25'
                                    onClick={() => setIsActive([])}
                                >
                                    Collapse all sections
                                </button>
                            </div>
                        </div>
                        
                    </div>          

                    {/* course details Accordion */}
                    <div className='py-4'>
                        {
                            courseContent?.map((course, index) => (
                                <CourseAccordionBar
                                    course={course}
                                    key={index}
                                    isActive={isActive}
                                    handleActive={handleActive}
                                />
                            ))
                        }
                    </div>
                    
                    {/* author details */}
                    <div className="mb-12 py-4">
                        <p className='text-[28px] font-semibold'>Author</p>
                        
                        <div className="flex items-center gap-4 py-4">
                            <img
                                src={instructor.image 
                                    ? instructor.image
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                                }
                                alt='Author'
                                className="h-14 w-14 rounded-full object-cover"
                            />

                            <p className='text-lg'>
                                {`${instructor.firstName} ${instructor.lastName}`}
                            </p>
                        </div>
                        
                        <p className='text-richblack-50'>
                            {instructor?.additionalDetails?.about}
                        </p>
                    </div>
                </div>
            </div>
            
        </div>


        <Footer/>
        
        { confirmationModal && <ConfirmationModal modalData={confirmationModal}/> }
    </>
  )
}
