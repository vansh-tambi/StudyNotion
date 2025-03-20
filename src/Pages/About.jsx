import React from 'react'

import BannerImage1 from '../assets/Images/aboutus1.webp'
import BannerImage2 from '../assets/Images/aboutus2.webp'
import BannerImage3 from '../assets/Images/aboutus3.webp'
import FoundingStoryImage from '../assets/Images/FoundingStory.png'

import HighlightText from '../components/core/HomePage/HighlightText'
import Quote from '../components/core/AboutPage/Quote'
import { LearningGrid } from '../components/core/AboutPage/LearningGrid'
import { ContactForm } from '../components/core/AboutPage/ContactForm'
import Footer from '../components/common/Footer'
import { Stats } from '../components/core/AboutPage/Stats'
import { ReviewSlider } from '../components/common/ReviewSlider'

function About() {
  return (
    <div>
        {/* Section-1 */}
        <section className='bg-richblack-800'>
            <h2 className='text-center text-richblack-200 font-semibold pt-[90px]'>About us</h2>
            <div className='w-11/12 max-w-maxContent mx-auto mt-12'>
                <div>
                
                    <div className='flex flex-col justify-center items-center text-richblack-5'>
                        <p className='text-center text-3xl md:text-4xl font-semibold w-[60%]'>
                            Driving Innovation in Online Education for a 
                        </p>
                        <p className='text-center text-3xl md:text-4xl w-[60%] mt-1'>
                            <HighlightText text={'Brighter Future'}/>
                        </p>
                        <p className='text-center text-md w-[65%] mt-4 font-[500] text-richblack-300'>
                            StudyNotion is at the forefront of driving innovation in online education. We're passionate about creating a future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                        </p>
                    </div>

                    {/* Images box */}
                    <div className='flex justify-center flex-row gap-x-6 mt-14 -mb-20'>
                        <img className='w-[32%]' src={BannerImage1} alt='img' loading='lazy'/>
                        <img className='w-[32%]' src={BannerImage2} alt='img' loading='lazy'/>
                        <img className='w-[32%]' src={BannerImage3} alt='img' loading='lazy'/>
                    </div>
                </div>
            </div>
        </section>

        {/* section-2 */}
        <section className='bg-richblack-900 border-b border-richblack-600'>
            <div className='w-11/12 max-w-maxContent mx-auto text-white mb-20'>

                <div className='pt-20'>
                    <div className='flex justify-center items-center'>
                        <Quote/>
                    </div>
                </div>

            </div>
        </section>


        {/* Section-3 */}
        <section className='bg-richblack-900'>
            <div className='w-11/12 max-w-maxContent mx-auto text-white mb-20'>

                <div className='mt-24'>
                
                    <div className='flex flex-col'>
                        {/* Founding story div */}
                        <div className='flex flex-col space-y-6 md:flex-row items-start md:items-center justify-evenly'>
                            {/* Left-box */}
                            <div className='flex flex-col space-y-8 md:w-[40%]'>
                                <div>
                                    <h2 className='text-3xl font-semibold text-pink-200'>Our Founding Story</h2>
                                </div>

                                <div className='text-richblack-300 flex flex-col space-y-4'>
                                    <p>
                                        Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                                    </p>

                                    <p>
                                        As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                                    </p>

                                </div>
                            </div>

                            {/* Right box */}
                            <div>
                                <img src={FoundingStoryImage} alt='img'/>
                            </div>
                        </div>

                        {/* Vision and mission div */}
                        <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row mt-36 justify-evenly'>
                            {/* Left-box */}
                            <div className='w-full md:w-[40%] flex flex-col space-y-8'>
                                <h2 className='text-3xl font-semibold text-brown-200'>Our Vision</h2>
                                <p className='text-richblack-300'>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                            </div>

                            {/* Right-box */}
                            <div className='w-full md:w-[40%] flex flex-col space-y-8'>
                                <h2 className='text-3xl font-semibold text-blue-100'>
                                    Our Mission
                                </h2>
                                <p className='text-richblack-300'>
                                    Our mission goes beyond just delivering courses online. We wanted to create 
                                    a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
        
        {/* Section-4 */}
        <section className='bg-richblack-800 py-14 sm:py-28 border-b border-richblack-600'>
            <div className='w-11/12 max-w-maxContent mx-auto text-white'>
                <div>
                    <Stats/>
                </div>
            </div>
        </section>

        {/* Section-5 */}
        <section className='bg-richblack-900 pt-16'>
            <div className='w-11/12 max-w-maxContent mx-auto text-white'>
                <div>
                    <LearningGrid/>
                </div>
            </div>
        </section>

        {/* Section-6 and 7 */}
        <div className='bg-richblack-900'>
            <div className='w-11/12 max-w-maxContent mx-auto text-white'>

                {/* Section-6 */}
                <div className='flex justify-center items-center'>
                    <ContactForm/>
                </div>

                {/* Section-7 */}
                <div className='mt-28 text-center mb-14'>
                    <h2 className='text-3xl font-semibold'>Reviews from other learners</h2>

                    {/* Review slider */}
                    <ReviewSlider/>
                </div>
            </div>
        </div>



        {/* Footer */}
        <section className='border-t border-richblack-600'>
            <Footer/>
        </section>
    </div>  
  )
}

export default About