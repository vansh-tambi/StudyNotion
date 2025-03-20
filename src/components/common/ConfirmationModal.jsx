import React from 'react'
import { IconBtn } from './IconBtn'

export const ConfirmationModal = ({modalData}) => {
  return (
    <div className='absolute z-10 top-0 left-0 right-0 bottom-0 bg-richblack-900/30 backdrop-blur-md text-richblack-25 bg-opacity-90 p-4 rounded-lg'>

        {/* Modal container */}
        <div className='absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-richblack-500/20 p-8 rounded-lg flex flex-col gap-8'>
            <div className='flex flex-col gap-2'>
                <p>{modalData.text1}</p>
                <p>{modalData.text2}</p>
            </div>

            <div className='flex space-x-8 font-semibold'>
                <IconBtn
                    onClick={modalData?.btn1Handler}
                    text={modalData.btn1Text}
                    customClasses={'bg-[#D11A2A] text-white'}
                />
                <IconBtn
                    onClick={modalData?.btn2Handler}
                    text={modalData.btn2Text}
                    customClasses={'bg-[#0BDA51] text-richblack-900'}
                />
            </div>
        </div>
    </div>
  )
}
