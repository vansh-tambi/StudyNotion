import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import ReactStars from 'react-stars';

import { IconBtn } from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

import { RxCross2 } from "react-icons/rx"

export const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);

    const {courseId} = useParams();
    // if courseId not works then use courseEntireData
    // const {courseEntireData} = useSelector((state) => state.viewCourse);
    
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    const onSubmit = async (data) => {
        await createRating({
            courseId,
            // courseId: courseEntireData._id,
            rating: data.courseRating,
            review: data.courseExperience,
        }, token);

        setReviewModal(false);
    }

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    }

    useEffect(() => {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    }, []);

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            {/* heading */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button
                    onClick={() => setReviewModal(false)}
                >
                    <RxCross2 className="text-2xl text-richblack-5" />
                </button>
            </div>

            {/* main container */}
            <div className="p-6">
                {/* user details */}
                <div div className="flex items-center justify-center gap-x-4">
                    <img
                        src={user?.image}
                        alt={user?.firstName + "profile"}
                        className='className="aspect-square w-[50px] rounded-full object-cover"'
                    />

                    <div>
                        <p className="font-semibold text-richblack-5">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-richblack-5">Posting Publicly</p>
                    </div>
                </div>

                {/* review form */}
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 flex flex-col items-center" 
                >
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        activeColor="#ffd700"
                    />

                    <div className="flex w-11/12 flex-col space-y-2">
                        <label
                            htmlFor='courseExperience'
                            className="text-sm text-richblack-5"
                        >
                            Add your Experinces <sup className="text-pink-200">*</sup>
                        </label>

                        <textarea
                            id='courseExperience'
                            placeholder='Add your experience'
                            {...register('courseExperience', {required:true})}
                            className="form-style resize-x-none min-h-[130px] w-full"
                        />
                        {
                            errors.courseExperience && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Please add your experience
                                </span>
                            )
                        }
                    </div> 
                    
                    {/* cancel & save button */}
                    <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                        <button
                            onClick={() => setReviewModal(false)}
                            type='button'
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                        >
                            Cancel
                        </button>

                        <IconBtn
                            text="Save"
                        />
                    </div>   
                </form>
            </div>
        </div>
    </div>
  )
}
