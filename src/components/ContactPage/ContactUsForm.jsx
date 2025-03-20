import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import CountryCode from '../../data/countrycode.json';
import { contactUs } from '../../services/operations/contactUsAPI';


export const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register, 
    handleSubmit, 
    reset,
    formState: {errors, isSubmitSuccessful},
  } = useForm();  

  const contactFormSubmitHandler = async (data) => {
    // console.log("logging data: ", data);
    // call API
    await contactUs(setLoading, data);
  }

  useEffect(() => {
      if(isSubmitSuccessful) {
        reset({
          email: '',
          firstName: '',
          lastName: '',
          message: '',
          phone: '',
        });
      }
  }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(contactFormSubmitHandler)}>
      
      <div className='flex flex-col gap-6 text-richblack-50'>
          {/* first name & last name */}
          <div className='flex flex-col md:flex-row gap-5'>
              {/* first name */}
              <div>
                  <label className='flex flex-col'>
                      <p className='text-richblack-25 text-sm'>
                        First Name<sup className='text-pink-200'>*</sup>
                      </p>
                      <input 
                        type='text'
                        name='firstName'
                        id='firstName'
                        placeholder='Enter first name'
                        className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        {...register('firstName', {required:true})}
                      />
                      {
                        errors.firstName && (
                          <span className='text-richblack-300'>Enter your first name</span>
                        )
                      }
                  </label>
              </div>
              {/* last name */}
              <div>
                  <label className='flex flex-col'>
                      <p className='text-richblack-25 text-sm'>
                        Last Name
                      </p>
                      <input 
                        type='text'
                        name='lastName'
                        id='lastName'
                        placeholder='Enter last name'
                        className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        {...register('lastName')}
                      />
                  </label>
              </div>
          </div>

          {/* email */}
          <div>
            <label>
              <p className='text-richblack-25 text-sm'>
                Email Address<sup className='text-pink-200'>*</sup>
              </p>
              <input
                className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                type='email'
                name='email'
                id='email'
                placeholder='Enter email address'
                
                {...register('email', {required:true})}
              />
                {
                    errors.email && (
                      <span className='text-richblack-300'>Enter your email address</span>
                    )
                }
            </label>
          </div>

          {/* phone-number */}
          <div>
              <label>
                  <p className='text-richblack-25 text-sm'>
                    Phone Number<sup className='text-pink-200'>*</sup>
                  </p>
                  <div className='flex flex-col sm:flex-row gap-5 items-start sm:items-center'> 
                    {/* country codes dropdown */}
                    <select
                    className='flex w-1/3 sm:w-[80px] px-1 py-3 mt-2 gap-5 bg-richblack-800 text-richblack-200 border-b border-richblack-500 rounded-md'
                    name='dropdown'
                    id='dropdown'
                    {...register('countryCode', {required:true})}
                    >
                      {
                        CountryCode.map((item, idx) => (
                          <option key={idx} value={item.code}>
                            {item.country} {item.code}
                          </option>
                        ))
                      }
                    </select>
                      
                      {/* phone number input box */}
                    <div className='relative w-full'>
                      <input
                        type='number'
                        name='phone'
                        id='phone'
                        placeholder='1234 567890'
                        className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        {...register('phone',
                          {
                            required:{value:true, message:'Please enter phone number'}, 
                            maxLength:{value:10, message:'Invalid phone number'},
                            minLength: {value:8, message:'Invalid phone number'}
                        })}
                      />
                      {
                        errors.phone && (
                          <span className='text-richblack-300 md:absolute md:-bottom-6 md:left-0'>{errors.phone.message}</span>
                        )
                      }
                    </div>
                  </div>
              </label>
          </div>

          {/* message-box */}
          <div>
              <label>
                  <p className='text-richblack-25 text-sm'>
                    Message<sup className='text-pink-200'>*</sup>
                  </p>
                  <textarea
                    name='message'
                    id='message'
                    rows={4}
                    placeholder='Enter message here'
                    className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                    {...register('message', {required:true})}
                  />
                  {
                      errors.message && (
                        <span className='text-richblack-300'>Please enter your message</span>
                      )
                  }
              </label>
          </div>
            
          {/* Submit-button */}
          <button 
            type='submit'
            className='text-center w-full text-md py-2 rounded-md font-semibold bg-yellow-50 hover:scale-[98%] transition-all duration-200 text-richblack-900'>
              Send Message
          </button>
      </div>
    </form>
  )
}
