import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { CourseCard } from './CourseCard';


export const CourseSlider = ({courses}) => {
  return (
    <>
        {
            courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={25}
                    autoplay={{
                        delay: 2500,
                    }}
                    breakpoints={{
                        1024: {
                        slidesPerView: 3,
                        },
                    }}
                    modules={[Autoplay,FreeMode,Pagination]}
                    className="max-h-[30rem]"
                >
                    {
                        courses.map((course, index) => (
                            <SwiperSlide key={index}>
                                <CourseCard course={course} Height={'h-[250px]'}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ) : (
                <p className="text-xl text-richblack-5">No Course Found</p>
            )
        }
    </>
  )
}
