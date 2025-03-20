import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { getPasswordResetToken } from '../services/operations/authAPI';

import { HiMiniArrowLongLeft } from "react-icons/hi2";

function ForgotPassword() {
    const {loading} = useSelector((state) => state.auth);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
        // setEmail('');
    }

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center px-8 md:px-0'>
    {
        loading ? (<></>)
        : (
            <div>
                <h1 className='text-xl font-semibold text-white'>
                    {
                        !emailSent ? 'Reset your Password' : 'Check your email'
                    }
                </h1>        

                <p className='text-richblack-200 max-w-sm mt-2'>
                    {
                        !emailSent ? "Have no fear. We'll emaill you instructions to reset your password. If you dont have access to your email we can try account recovery"
                        : `We have sent the reset email to ${email}`
                    }
                </p>

                <form onSubmit={handleSubmit}>
                    {
                        !emailSent && (
                            <label>
                                <p className='text-richblack-25 text-sm mt-6'>Email Address<sup className='text-pink-300 font-semibold'>*</sup></p>
                                <input 
                                    className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 mt-2 rounded-md'
                                    required 
                                    type='email' 
                                    name='email' 
                                    value={email} 
                                    onChange = {(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email address'>
                                </input>
                            </label>
                        )
                    }
                    
                    
                    <button 
                        type='submit'
                        className='mt-8 text-center w-full text-md py-3 rounded-md font-semibold bg-yellow-50 hover:scale-[98%] transition-all duration-200'>
                        {
                            !emailSent ? "Reset Password"
                            : "Resend email"
                        }
                    </button>
                </form>

                <div className='text-richblack-100 hover:text-richblack-25 mt-6 transition-all duration-200'>
                    <Link to='/login'>
                        <div className='flex space-x-1 items-center'>
                            <HiMiniArrowLongLeft size={20}/>
                            <p>Back to login</p>
                        </div>  
                    </Link>
                </div>
            </div>
        )
    }
    </div>
  )
}

export default ForgotPassword