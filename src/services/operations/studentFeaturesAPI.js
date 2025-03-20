import toast from 'react-hot-toast';

import {apiConnector} from '../apiConnector';
import {studentEndpoints} from '../apis';

import { setPaymentLoading } from '../../slices/courseSlice';
import { removeFromCart } from '../../slices/cartSlice';

import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { removeItemFromCart } from './cartAPI';
import { getFullCartDetails } from './cartAPI';

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        
        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    });
}

export async function buyCourse(courses, token, userDetails, navigate, dispatch, buyingFromCatalogPage=false) {
    const toastId = toast.loading("Loading...");

    try {
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.err("Razorpay SDK failed to load");
            return;
        }

        // initiate the order
        const orderResponse = await apiConnector(
            "POST", 
            COURSE_PAYMENT_API, 
            {courses},
            {Authorization: `Bearer ${token}`}
        );

        if(!orderResponse?.data?.success) {
            throw new Error(orderResponse?.data?.message);
        }

        // create options
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: orderResponse.data.data.amount,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,
            },
            handler: function(response) {
                // send successful mail
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);

                // verify payment
                verifyPayment({...response, courses}, token, navigate, dispatch, userDetails.cart, buyingFromCatalogPage);
            }
        }

        // create razorpay payment modal
        const paymentObject = new window.Razorpay(options);
        // open payment modal
        paymentObject.open();

        paymentObject.on("payment.failed", function(response) {
            toast.error('oops, payment failed');
            // console.log(response.error);
        })

    } catch(err) {
        // console.error("BUY COURSE API error...", err);
        toast.error(err);
    }

    toast.dismiss(toastId);
}


// payment successful email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {Authorization: `Bearer ${token}`},
        );
    } catch(err) {
        console.log("PAYMENT SUCCESSFU EMAIL API error...", err);
    }
}


// verify payment
async function verifyPayment(bodyData, token, navigate, dispatch, cartId, buyingFromCatalogPage) {
    const toastId = toast.loading("Verifying payment...");

    // console.log("Logging buying from catalogpage value: ", buyingFromCatalogPage);

    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {Authorization: `Bearer ${token}`},
        );

        if(!response?.data?.success) {
            throw new Error(response?.data?.message);
        }

        // remove all courses from card from backend
        bodyData.courses.forEach(async (course) => {
            await removeItemFromCart(cartId, course, token, dispatch, buyingFromCatalogPage);
        });
       

        // update cart to cart slice
        const cartData = await getFullCartDetails(cartId, token);
        cartData.forEach((course) => dispatch(removeFromCart(course._id)));

        toast.success("Payment successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
    } catch(err) {
        // console.log("PAYMENT VERIFY error...", err);
        toast.error(err.message);
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}