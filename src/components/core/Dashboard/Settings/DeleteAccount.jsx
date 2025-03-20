import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { FiTrash2 } from "react-icons/fi"

import { deleteAccount } from '../../../../services/operations/settingsAPI';
import { ConfirmationModal } from '../../../common/ConfirmationModal';


function DeleteAccount() {
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [confirmationModal, setConfirmationModal] = useState(null);

    return (
        <section className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        
            <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
                <FiTrash2 className="text-3xl text-pink-200" />
            </div>

            <div className='flex flex-col space-y-2'>
                <h3 className='text-lg font-semibold text-richblack-5'>
                    Delete Account
                </h3>

                <div className="w-3/5 text-pink-25">
                    <p>Would you like to delete account?</p>
                    <p> 
                        This account may contain Paid Courses. Deleting your account is 
                        permanent and will remove all the contain associated with it.
                    </p>
                </div>

                <h3 
                className='text-pink-300 italic cursor-pointer 
                hover:text-pink-500 transition-all duration-200'
                onClick={() => setConfirmationModal({
                    text1: 'Are you sure ?',
                    text2: 'Your Account will be deleted permanently!',
                    btn1Text: 'Delete',
                    btn2Text: 'Cancel',
                    btn1Handler: () => dispatch(deleteAccount(token, navigate)),
                    btn2Handler: () => setConfirmationModal(null),
                })}> 
                    I want to delete my account.
                </h3>
            </div>


        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}

        </section>
    )
}

export default DeleteAccount