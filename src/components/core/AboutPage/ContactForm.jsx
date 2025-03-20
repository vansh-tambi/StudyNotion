import React from 'react'
import { ContactUsForm } from '../../ContactPage/ContactUsForm'

export const ContactForm = () => {
  return (
    <div className='mx-auto flex flex-col space-y-14 mt-28'>
        <div className='flex flex-col space-y-6'>
          <h2 className='text-center text-4xl font-semibold text-richblack-5'>Get in Touch</h2>
          <p className='text-center text-[16px] leading-3 text-richblack-200 font-semibold'>We'd love to here for you, Please fill out this form.</p>
        </div>
      
        <ContactUsForm/>
    </div>
  )
}
