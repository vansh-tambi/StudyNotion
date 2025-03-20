import toast from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";

import {setLoading, setUser} from '../../slices/profileSlice'
import { logout } from "./authAPI";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

export function getUserDetails(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector(
                "GET",
                GET_USER_DETAILS_API,
                null,
                {Authorization: `Bearer ${token}`},
            );

            // console.log('get user details api response: ', response);

            const userImage = response.data.data.image 
                ? response.data.data.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
            
            dispatch(setUser({...response.data.data, image:userImage}));
        } catch(err) {
            // console.log('Get user details api error...', err);
            toast.error(err.response.data.message);
            dispatch(logout(navigate));
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Fetching courses...");
    let data = [];
    try {
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {Authorization: `Bearer ${token}`}
        );

        if(!response?.data?.success) {
            throw new Error("Can't fetch user enrolled courses");
        }

        // console.log("GET USER ENROLLED COURSE response....", response);

        data = response?.data?.data;
    } catch(err) {
        // console.log("GET USER ENROLLED COURSE error...",err);
        toast.error(err.message);
    }

    toast.dismiss(toastId);
    
    return data;
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector(
            "GET",
            GET_INSTRUCTOR_DATA_API,
            {},
            {Authorization: `Bearer ${token}`},
        )

        // console.log("GET INSTRUCTOR DATA API response...", response);

        result = response?.data;

    } catch(err) {
        // console.log("error in GET INSTRUCTOR DATA API.....", err);
        toast.error("Could not get instructor data");
    }

    toast.dismiss(toastId);
    return result;
}