import React from 'react'

import Footer from '../components/common/Footer'
import { ContactUsForm } from '../components/ContactPage/ContactUsForm'

import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaEarthAfrica } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { ReviewSlider } from '../components/common/ReviewSlider';

export const ContactUs = () => {
  return (
    <div className='bg-richblack-900'>
        <div className='w-11/12 max-w-maxContent mx-auto mt-20'>
        
            {/* Section-1 */}
            <section className='flex flex-col md:flex-row space-y-16 md:space-y-0 justify-center items-center md:items-start md:justify-between'>
                {/* Left-part */}
                <div className='bg-richblack-800 h-fit p-10 w-full md:w-[35%] flex flex-col gap-10 rounded-lg'>
                    <div className='flex space-x-2'>
                        <div className='text-richblack-200 mt-[5px] text-xl'>
                            <HiChatBubbleLeftRight />
                        </div>

                        <div className='text-richblack-200 text-sm'>
                            <h2 className='text-richblack-25 text-lg font-[500]'>Chat on us</h2>
                            <p>Our friendly team is here to help.</p>
                            <p>something@gmail.com</p>
                        </div>
                    </div>

                    <div className='flex space-x-2'>
                        <div className='text-richblack-200 mt-[5px] text-xl'>
                            <FaEarthAfrica />
                        </div>

                        <div className='text-richblack-200 text-sm flex flex-col gap-1'>
                            <h2 className='text-richblack-25 text-lg font-[500]'>Visit us</h2>
                            <p>Come here and say hello at our office HQ.</p>
                            <p>Speke Rd, Kampala Capital City, Uganda</p>
                        </div>
                    </div>

                    <div className='flex space-x-2'>    
                        <div className='text-richblack-200 mt-[5px] text-xl'>
                            <MdCall />
                        </div>
                        
                        <div className='text-richblack-200 text-sm'>
                            <h2 className='text-richblack-25 text-lg font-[500]'>Call us</h2>
                            <p>Mon-Fri from 8am to 5pm</p>
                            <p>+123 456 7890</p>
                        </div>
                    </div>
                </div>
                
                {/* Right box */}
                <div className='p-16 border border-richblack-400 rounded-lg w-full md:w-[55%] flex flex-col gap-10'>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-4xl text-richblack-25 font-semibold'>
                            Got a Idea? We've got the skills. Let's team up
                        </h2>
                        <p className='text-richblack-200'>
                            Tell us more about yourself and what you've got in mind.
                        </p>
                    </div>

                    <div className='flex'>
                        <ContactUsForm/>
                    </div>
                </div>
            </section>

            {/* Section-2 */}
            <section className='mt-32 text-center mb-14'>
                <h2 className='text-4xl font-semibold text-richblack-25'>Reviews from other learners</h2>

                {/* Review slider */}
                <ReviewSlider/>
            </section>
        </div>

        <div className='border-t border-richblack-500'>
            <Footer/>
        </div>
    </div>
  )
}
