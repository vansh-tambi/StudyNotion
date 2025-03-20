import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";

import { settingsEndpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} = settingsEndpoints;

export function uploadDisplayPicture(token, displayPicture) {
    return async (dispatch) => {
        const toastId = toast.loading('Uploading...');
        try {
            const response = await apiConnector(
                "PUT", 
                UPDATE_DISPLAY_PICTURE_API, 
                displayPicture,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            );
            // console.log('Logging UPLOAD DISPLAY PICTURE API response...', response);

            // update user details in the store
            dispatch(setUser(response.data.data));
            toast.success('Profile picture updated successfully');
        } catch(err) {
            // console.log('UPLOAD DISPLAY PICTURE API error...',err);
            toast.error(err.response.data.message);
        }
        toast.dismiss(toastId);
    }
}

export function updateProfileDetails(token, formData, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Saving...');
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_API,
                formData,
                { Authorization: `Bearer ${token}`,}
            );

            // console.log("UPDATE PROFILE DETAILS API response... ",response);

            // update user image if it was created using dicebar API
            const responseImage = response.data.data.image;
            const userImage = (responseImage && !responseImage.includes('api.dicebar.com'))
                ? responseImage 
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`

            dispatch(setUser({...response.data.data, image:userImage}));

            toast.success('Profile details updated successfully');
            navigate('/dashboard/my-profile');
        } catch(err) {
            // console.log('UPDATE PROFILE DETAILS API error...',err);
            toast.error(err.response.data.message);
        }
        toast.dismiss(toastId);
    }
}

export async function changePassword(token, formData, navigate) {
    const toastId = toast.loading("Changing password...");
    try {
        await apiConnector(
        "POST",
        CHANGE_PASSWORD_API,
        formData,
        { Authorization: `Bearer ${token}` },
        )

        // console.log("CHANGE PASSWORD API response... ", response);

        toast.success("Password changed successfully");
        navigate('/dashboard/my-profile');
    } catch(err) {
        // console.log('CHANGE PASSWORD API error...',err);
        toast.error(err.response.data.message);
    }

    toast.dismiss(toastId);
}

export function deleteAccount(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting account...");

        try {
            await apiConnector(
                "DELETE",
                DELETE_PROFILE_API,
                null,
                { Authorization: `Bearer ${token}`,}
            );
            
            toast.success("Account deleted successfully");
            dispatch(logout(navigate));
        } catch(err) {
            // console.log('DELETE  ACCOUNT API error...', err);
            toast.error(err.response.data.message);
        }

        toast.dismiss(toastId);
    }
}