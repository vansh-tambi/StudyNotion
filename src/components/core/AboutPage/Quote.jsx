import React from 'react'
import HighlightText from '../HomePage/HighlightText'

import { MdFormatQuote } from "react-icons/md";

function Quote() {
  return (
    <div className='mt-24 flex flex-col gap-3 justify-center items-center text-3xl font-semibold w-[95%] text-richblack-200'>
        <div className='text-center'>
          <span className='relative'>
            <span className='absolute text-richblack-400 rotate-180 -left-8 -top-2'>
              <MdFormatQuote />
            </span>
            We are passionate about revolutionizing the way we learn. 
          </span>
        </div>

        <div className='text-center'>
          Our innovative platform 
          <HighlightText text={'combines technology'}/> 
          <span className='text-brown-100'>{" "}expertise</span>
          , and community to 
        </div>

        <div className='text-center'>
          create an
          <span className='text-brown-100 relative'>
            {" "}unparalled educational experience.
              <span className='absolute text-richblack-400 bottom-2 -right-8'>
                <MdFormatQuote />
              </span>
          </span>
        </div>
    </div>
  )
}

export default Quote