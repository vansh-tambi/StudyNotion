import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars';

import { FaRegStar, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { removeItemFromCart } from '../../../../services/operations/cartAPI';

export const RenderCartCourses = () => {
    const {cart} = useSelector((state) => state.cart);
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();

    const getAverageRating = async () => {
        // call average rating api
        // set rating with response
    }

    const handleCartRemove = async (courseId) => {
        const cartId = user.cart;
        await removeItemFromCart(cartId, courseId, token, dispatch);
    }

    useEffect(() => {
        getAverageRating();
    }, []);

  return (
    <div className="flex flex-1 flex-col">
        {
            cart.map((course, index) => (
                <div 
                    key={course._id}
                    className={ `flex w-full flex-wrap items-start justify-between gap-6 
                    ${index != cart.length-1 && 'border-b border-b-richblack-400 pb-6'}
                    ${index != 0 && 'mt-6'}` }
                >
                        <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                            <img 
                                src={course.thumbnail}
                                className="h-[148px] w-[220px] rounded-lg object-cover"
                            />

                            <div className="flex flex-col space-y-1">
                                <p className="text-lg font-medium text-richblack-5">
                                    {course?.CourseName}
                                </p>
                                <p className="text-sm text-richblack-300">
                                    {course?.category?.name}
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-5">{rating}</span>
                                    <ReactStars
                                        count={5}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaRegStar/>}
                                        fullIcon={<FaStar/>}
                                        value={rating}
                                    />
                                    <span className="text-richblack-400">
                                        {course?.ratingAndReviews?.length} Ratings
                                    </span>

                                </div>
                            </div>
                        </div>

                        <div 
                            className="flex flex-col items-end space-y-2"
                        >
                                <button 
                                    onClick={() => handleCartRemove(course._id)}
                                    className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                                >
                                        <MdDelete />
                                        <span>Remove</span>
                                </button>

                                <p className="mb-6 text-3xl font-medium text-yellow-100">
                                    {course?.price}
                                </p>
                        </div>
                    
                </div>
            ))
        }
    </div>
  )
}
