import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { HiMiniArrowLongLeft } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import '../components/common/loader.css'
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdatePassword() {
    const {loading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState( {
        password: '',
        confirmPassword: ''
    });

    const {password, confirmPassword} = formData;

    const [showNewPassword, setShowNewPassoword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleFormChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // if both password are not matching
        if(password !== confirmPassword) {
            toast.error('Password are not matching');
            return;
        }

        // if any condition of password pattern is not true
        if(
            !/[a-z]/.test(password) ||  // if not contains lowercase
            !/[A-Z]/.test(password) ||  // if not contains uppercase
            !/[0-9]/.test(password) ||  // if not contains number
            !/[0-9]/.test(password) ||  // if not contains number
            !/[^a-zA-Z0-9]/.test(password) || // if not contains special
            !password.length >= 8 // if not 8 characters minimum
        ) {
            toast.error('All conditions must be true');
            return;
        }

        const token = location.pathname.split('/').at(-1);
        console.log('token is: ', token);
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    }

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center px-8 md:px-0'>
        {
            loading ? (<div  className='spinner'></div>)
            : (
                <div>
                    <h1 className='text-xl font-semibold text-white'>
                        Choose new password
                    </h1>
                    <p className='text-richblack-200 max-w-sm mt-2'>
                        Almost done. Enter your new password and you are all set
                    </p>

                    <form onSubmit={handleFormSubmit}>
                        <labeL className='relative'>
                            <p className='text-richblack-25 text-sm mt-6'>
                                New password <sup className='text-pink-300 font-semibold'>*</sup>
                            </p>
                            <input
                                className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                                required
                                type={`${showNewPassword ? 'text' : 'password'}`}
                                name='password'
                                value={password}
                                placeholder='Enter new password'
                                onChange={handleFormChange}
                            />
                            <span 
                              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                              onClick= {() => setShowNewPassoword((prev) => !prev)}>
                                {
                                    showNewPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />)
                                    : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                                }
                            </span>
                        </labeL>

                        <label className='relative'>
                            <p className='text-richblack-25 text-sm mt-6'>
                                Confirm New password <sup className='text-pink-300 font-semibold'>*</sup>
                            </p>
                            <input
                                className='bg-richblack-800 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                                required
                                type={`${showConfirmPassword ? 'text' : 'password'}`}
                                name='confirmPassword'
                                value={confirmPassword}
                                placeholder='Confirm new password'
                                onChange={handleFormChange}
                            />
                            <span 
                              className="absolute right-3 top-[98px] z-[10] cursor-pointer"
                              onClick= {() => setShowConfirmPassword((prev) => !prev)}>
                                {
                                    showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />)
                                    : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                                }
                            </span>
                        </label>
                        
                        {/* Password conditions box */}
                        <div className='mt-8 text-xs flex flex-row gap-x-4'>
                            <div className='flex flex-col gap-2'>
                                <div 
                                className={`flex items-center gap-x-2 
                                    ${/[a-z]/.test(password) ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        /[a-z]/.test(password) ? <FaCheckCircle /> : <MdCancel />
                                    }
                                    <p>One lowercase character</p>
                                </div>
                                <div className={`flex items-center gap-x-2 
                                    ${/[A-Z]/.test(password) ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        /[A-Z]/.test(password) ? <FaCheckCircle /> : <MdCancel/>
                                    }
                                    <p>One uppercase character</p>
                                </div>
                                <div className={`flex items-center gap-x-2
                                    ${/[0-9]/.test(password) ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        /[0-9]/.test(password) ? <FaCheckCircle /> : <MdCancel/>
                                    }
                                    <p>One number</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className={`flex items-center gap-x-2
                                    ${/[^a-zA-Z0-9]/.test(password) ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        /[^a-zA-Z0-9]/.test(password) ? <FaCheckCircle /> : <MdCancel/>
                                    }
                                    <p>One special character</p>
                                </div>
                                <div className={`flex items-center gap-x-2
                                    ${password.length >= 8 ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        password.length >= 8 ? <FaCheckCircle /> : <MdCancel/>
                                    }
                                    <p>8 characters minimum</p>
                                </div>
                                <div className={`flex items-center gap-x-2
                                    ${password.length > 0 && password === confirmPassword ? 'text-caribbeangreen-200' : 'text-pink-200'}`}>
                                    {
                                        password.length > 0 && password === confirmPassword ? <FaCheckCircle /> : <MdCancel/>
                                    }
                                    <p>Password matching</p>
                                </div>
                            </div>
                            
                            
                        </div>

                        <button 
                            type='submit' 
                            className='mt-8 text-center w-full text-md py-3 rounded-md font-semibold bg-yellow-50 hover:scale-[98%] transition-all duration-200'>
                            Reset Password
                        </button>
                    </form>

                    <div className='text-richblack-100 hover:text-richblack-25 mt-6 transition-all duration-25'>
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

export default UpdatePassword