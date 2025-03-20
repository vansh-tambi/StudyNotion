import React, { useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast';

import { IconBtn } from '../../../common/IconBtn';
import { FaXmark } from "react-icons/fa6";
import { uploadDisplayPicture } from '../../../../services/operations/settingsAPI';

function UpdatePhoto() {

  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth);
  const [file, setFile] = useState('');

  const ref = useRef();
  const dispatch = useDispatch();

  const uploadProfilePictureHandler = () => {
    if(!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // validate image type
    const file_extension = file.name.split('.').at(-1).toLowerCase();
    // console.log(file_extension);
    if(file_extension !== 'jpeg' && file_extension !== 'jpg' && file_extension !== 'png') {
      toast.error("Please upload jpg, jpeg or png image");
      return;
    }
    
    // const formData = new FormData();
    // formData.append("displayPicture", file);
    // console.log(formData);

    const formData = {displayPicture: file};
    // console.log(formData);
    dispatch(uploadDisplayPicture(token, formData));
  }

  return (
    <section className='flex flex-col sm:flex-row justify-center sm:justify-start gap-4 items-center bg-richblack-800 p-8 rounded-md'>
        {/* Profile picture div */}
        <div>
            <img 
                src={user?.image} 
                alt={`profile-${user?.firstName}`}
                className='aspect-square w-[80px] object-cover rounded-full'
            />
        </div>

        {/* Upload picture div */}
        <div className='flex flex-col gap-2'>
            <p className='text-center sm:text-start'>Change Profile Picture</p>
            
            <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-center space-x-4 items-center'>
                <div className='flex'>
                <input
                    className={`w-full text-sm text-gray-500 cursor-pointer
                    ${file ? 'text-md' : 'text-[0px]'}
                    file:me-4 file:py-3 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-richblack-700 file:text-richblack-100
                    hover:file:bg-richblack-600
                    transition-all duration-200 text-richblack-400`}
                    type='file'
                    name='file'
                    ref={ref}
                    onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button className='text-pink-300 w-3'
                    onClick={(e) => {
                        e.preventDefault();
                        ref.current.value = ''; 
                        setFile(null);
                    }}
                    >
                    <span className={`${file ? 'block' : 'hidden'}`}>
                        <FaXmark />
                    </span>
                    </button>
                </div>
                
                <IconBtn
                    text='Upload'
                    iconName={'FaUpload'} 
                    onClick={uploadProfilePictureHandler} 
                />
            </div>

        </div>
    </section>
  )
}

export default UpdatePhoto