import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart, setTotalItems, setCart, setTotal } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"

import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

import {getFullCartDetails} from './cartAPI';
import { ACCOUNT_TYPE } from '../../utils/constants'

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints


export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector(
        "POST", 
        SENDOTP_API, 
        {email}
      );
      // console.log("SENDOTP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      // console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector(
        "POST", 
        SIGNUP_API, 
        {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
      })

      // console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      // console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      // console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")

      // set token of auth slice
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      // set user of profile slice
      dispatch(setUser({ ...response.data.user, image: userImage }))
      // set user in local storage
      localStorage.setItem('user', JSON.stringify({ ...response.data.user, image: userImage }));
      // set token in local storage
      localStorage.setItem("token", JSON.stringify(response.data.token))

      // get user cart details
      if(response.data.user.accountType === ACCOUNT_TYPE.STUDENT) {
        const cartId = response.data.user.cart;
        const token = response.data.token;
        const cartData = await getFullCartDetails(cartId, token);

        dispatch(setCart(cartData));
        dispatch(setTotalItems(cartData?.length || 0));

        const totalPrice = cartData.reduce((acc, course) => {
          return acc += course.price;
        }, 0);

        dispatch(setTotal(totalPrice));
      }

      navigate("/dashboard/my-profile")
    } catch (error) {
      // console.log("LOGIN API ERROR............", error)
      // toast.error("Login Failed")
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      // console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      // console.log("RESETPASSTOKEN ERROR............", error)
      // toast.error("Failed To Send Reset Email")
      toast.error(error.message);
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      // console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      // console.log("RESETPASSWORD ERROR............", error)
      toast.error("Failed To Reset Password")
      navigate('/forgot-password')
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}