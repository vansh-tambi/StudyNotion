import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { IconBtn } from '../../../common/IconBtn';

import { updateProfileDetails } from '../../../../services/operations/settingsAPI';
import { useNavigate } from 'react-router-dom';

export const UpdateProfileDetails = () => {
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        dateOfBirth: `${user.additionalDetails.dateOfBirth ? user.additionalDetails.dateOfBirth : ''}`,
        gender: `${user.additionalDetails.gender ? user.additionalDetails.gender : 'Male'}`,
        contactNumber: `${user.additionalDetails.contactNumber ? user.additionalDetails.contactNumber : ''}`,
        about: `${user.additionalDetails.about ? user.additionalDetails.about : ''}`,
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => {
            return {
                ...prevData,
                [name]:value,
            }
        })
    }

    const submitHandler = async () => {
        // call updateProfile API
        dispatch(updateProfileDetails(token, formData, navigate));
    }

  return (
    <section>
        <div className='flex flex-col gap-8 bg-richblack-800 p-8 rounded-md'>
            <h4 className='font-[600] text-lg'>Profile Information</h4>

            <div className='grid grid-cols-1  md:grid-cols-2 gap-6'>
                {/* first name */}
                <label>
                    <p className='text-richblack-25 text-sm'>First Name</p>
                    <input
                        className='bg-richblack-700 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='Enter first name'
                    />
                </label>
                
                {/* last name */}
                <label>
                    <p className='text-richblack-25 text-sm'>Last Name</p>
                    <input
                        className='bg-richblack-700 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        type='text'
                        name='lastName'
                        placeholder='Enter last name'
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </label>

                {/* date of birth */}
                <label>
                    <p className='text-richblack-25 text-sm'>Date of Birth</p>
                    <input
                        className='bg-richblack-700 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        type='date'
                        name='dateOfBirth'
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </label>
                
                {/* gender */}
                <label>
                    <p className='text-richblack-25 text-sm'>Gender</p>
                    <select
                        className='flex px-3 py-[0.90rem] mt-2 w-full gap-5 bg-richblack-700 text-richblack-200 border-b border-richblack-500 rounded-md'
                        name='gender'
                        id='gender'
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </label>

                {/* contact number */}
                <label>
                    <p className='text-richblack-25 text-sm'>Contact Number</p>
                    <input
                        className='bg-richblack-700 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        type='text'
                        name='contactNumber'
                        placeholder='Enter contact number'
                        value={formData.contactNumber}
                        onChange={handleChange}
                    />
                </label>
                
                {/* about */}
                <label>
                    <p className='text-richblack-25 text-sm'>About</p>
                    <input
                        className='bg-richblack-700 text-richblack-25 border-b border-richblack-500 w-full py-3 px-3 pr-12 mt-2 rounded-md'
                        type='text'
                        name='about'
                        id='about'
                        placeholder='Enter about you'
                        value={formData.about}
                        onChange={handleChange}
                    />
                </label>
            </div>
        </div>

        <div className='flex justify-end mt-8 space-x-4'>
            <IconBtn
                text="Cancel"
                onClick={() => navigate('/dashboard/my-profile')}
                customClasses='text-richblack-25 bg-richblack-700 font-semibold'
            />
            <IconBtn
                text="Save"
                onClick={submitHandler}
            />
        </div>
    </section>
  )
}
