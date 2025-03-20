import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";  
import "swiper/css/free-mode";  
import "swiper/css/autoplay";  

import { Autoplay, FreeMode } from "swiper/modules";  
import ReactStars from "react-stars";  

import { FaStar } from "react-icons/fa";  

import { getRatingAndReviews } from "../../services/operations/ratingAndReviews";



export const ReviewSlider = () => {

    const [reviews, setReviews] = useState([]);
    const turncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async () => {
            const data = await getRatingAndReviews();
            setReviews(data);
        }

        fetchAllReviews();
    }, []);

  return (
    <div className="flex items-center justify-center">
        <div className="my-[50px] h-[250px] sm:[184px] overflow-hidden max-w-maxContentTab lg:max-w-maxContent">
            <Swiper 
                className="w-full"
                slidesPerView={1}
                loop={true}
                freeMode={true}
                autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                }}
                breakpoints={{
                '@0.00': {
                    slidesPerView: 2,
                    spaceBetween: 5,
                },
                '@0.75': {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                '@1.00': {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                '@1.50': {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
                }}
                modules={[Autoplay,FreeMode]}
            >
                {
                    reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col items-center sm:items-start gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                            
                                {/* reviewer details */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <img
                                        src={review?.user?.image 
                                            ? review?.user?.image 
                                            : `https://api.dicebar.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastname}`}
                                        alt=""
                                        className='h-9 w-9 rounded-full object-cover'
                                    />

                                    <div className="flex flex-col text-center sm:items-start">
                                        {/* student name */}
                                        <p className="font-semibold text-richblack-5">
                                            {review?.user?.firstName} {review?.user?.lastName}
                                        </p>

                                        {/* course name */}
                                        <p className="text-[12px] font-medium text-richblack-500">
                                            {review?.course?.courseName}
                                        </p>

                                    </div>
                                </div>
                                
                                {/* review */}
                                <p className="font-medium text-richblack-25">
                                {
                                    review?.review.split(" ").length > turncateWords 
                                    ? (review?.review.split(' ')
                                        .splice(0,turncateWords)
                                        .join(' ')+"...") 
                                    : (review?.review)
                                }
                                </p>
                                
                                {/* rating & stars */}
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <p className="font-semibold text-yellow-100">
                                        {review?.rating.toFixed(1)}
                                    </p>

                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false}
                                        activeColor='#ffd700'
                                        emptyIcon={<FaStar/>}
                                        fullIcon={<FaStar/>}
                                        disableOnInteraction={false}
                                    />  
                                </div>

                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}
