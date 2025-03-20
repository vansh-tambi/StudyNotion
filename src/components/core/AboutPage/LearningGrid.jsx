import React from 'react'
import { useNavigate } from 'react-router-dom'

import HighlightText from '../HomePage/HighlightText';
import CTAButton from '../HomePage/CTAButton';

const learningGridData = [
    {
        order: -1,
        heading: 'World-Class Learning for',
        highlightText: 'Anyone, Anywhere',
        description: 'Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.',
        btnText: 'Learn More',
        btnLink: '/',
    },
    {
        order: 1,
        heading: 'Curriculum Based on Industry Needs',
        description: 'Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.',
    },
    {
        order: 2,
        heading: 'Our Learning Methods',
        description: 'The learning process uses the namely online and offline.',
    },
    {
        order: 3,
        heading: 'Certification',
        description: 'You will get a certificate that can be used as a certification during job hunting.',
    },
    {
        order: 4,
        heading: `Rating "Auto-grading"`,
        description: 'You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.',
    },
    {
        order: 5,
        heading: 'Ready to Work',
        description: 'Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.',
    },
]

export const LearningGrid = () => {

  const navigate = useNavigate();

  return (
    <div className='grid self-center mx-auto grid-cols-1 lg:grid-cols-4 mb-10 p-5'>
        {
            learningGridData.map((card, idx) => (
                <div
                key={idx}
                className={`${idx === 0 && 'lg:col-span-2'}
                ${idx > 0 && (card.order & 1 ? 'bg-richblack-700' : 'bg-richblack-800')}
                ${card.order === 3 && 'lg:col-start-2'}
                lg:h-[280px] p-5
                `}>
                    {
                        card.order < 0 ? (
                            <div className='lg:w-[90%] flex flex-col pb-5 gap-3'>
                                <div className='text-4xl font-semibold'>
                                    {card.heading}
                                    <HighlightText text={card.highlightText}/>
                                </div>
                                <p className='font-md'>{card.description}</p>

                                <div className='w-fit mt-4'>
                                    <CTAButton active={true} linkto={card.btnLink}>
                                        {card.btnText}
                                    </CTAButton>
                                </div>
                            </div>
                        ) 
                        : (
                            <div className='lg:w-[90%] flex flex-col pb-5 gap-10 px-3 py-7 lg:py-3'>
                                <h2 className='text-md font-semibold text-richblack-5'>{card.heading}</h2>
                                <p className='text-sm text-richblack-300 font-medium'>{card.description}</p>
                            </div>
                        ) 
                    }
                </div>
            ))
        }
    </div>
  )
}
