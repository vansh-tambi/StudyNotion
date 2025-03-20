import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { IconBtn } from '../../common/IconBtn';

export const MyProfile = () => {
    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();

  return (
    <div className='text-richblack-5 flex flex-col gap-10'>

        <h2 className='text-3xl font-[500]'>
            My Profile
        </h2>


        {/* Section-1 */}
        <section className='flex justify-between items-center bg-richblack-800 p-8 rounded-md'>
            <div className='flex items-center gap-4'>
                <img 
                    src={user?.image} 
                    alt={`profile-${user?.firstName}`}
                    className='aspect-square w-[60px] object-cover rounded-full'
                />
                <div>
                    <p className='font-semibold text-lg'>{user?.firstName + " " + user?.lastName}</p>
                    <p className='text-sm text-richblack-400 font-[500]'>{user?.email}</p>
                </div>
            </div>
            
            <IconBtn
                text='Edit'
                onClick={() => navigate('/dashboard/settings')}
                iconName={'FaEdit'}
            />
        </section>

        {/* Section-2 */}
        <section className='flex flex-col gap-8 bg-richblack-800 p-8 rounded-md'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>About</p>
                <IconBtn
                    text='Edit'
                    onClick={() => navigate('/dashboard/settings')}
                    iconName={'FaEdit'}
                />
            </div>
            <p className='text-sm text-richblack-400 font-[500]'>{user?.additionalDetails?.about ?? 'Write something about yourself.'}</p>
        </section>

        {/* Section-3 */}
        <section className='flex flex-col gap-10 bg-richblack-800 p-8 rounded-md'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>Personal Details</p>
                <IconBtn
                    text='Edit'
                    onClick={() => navigate('/dashboard/settings')}
                    iconName={'FaEdit'}
                />
            </div>

            <div className='grid grid-cols-2 gap-5 font-[500]'>
                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>First Name</p>
                    <p>{user?.firstName}</p>
                </div>
                
                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>Last Name</p>
                    <p>{user?.lastName}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>Email</p>
                    <p>{user?.email}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>Gender</p>
                    <p>{user?.additionalDetails?.gender ?? 'Add Gender'}</p>
                </div>
                
                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>Phone Number</p>
                    <p>{user?.additionalDetails?.contactNumber ?? 'Add Contact Number'}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='text-richblack-500'>Date of Birth</p>
                    <p>{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                </div>
            </div>

        </section>

    </div>
  )
}
