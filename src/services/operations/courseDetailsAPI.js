import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
    GET_ALL_COURSE_API,
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    LECTURE_COMPLETION_API,
    CREATE_RATING_API,
} = courseEndpoints;


export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await apiConnector("GET",GET_ALL_COURSE_API);
        // console.log('Get all Courses API response...', response);
        result = response.data.data;
    } catch(err) {
        // console.log("GET_ALL_COURSE API error........", err);
        toast.error(err.response.data.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector("POST", COURSE_DETAILS_API, {courseId});
        // console.log('Get Courses Details API response...', response);
        result = response.data.data;
    } catch(err) {
        // console.log('Fetch course details API error...', err);
        toast.error(err.response.data.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchCourseCategories = async () => {
    let result = [];
    try {
        const response = await apiConnector("GET", COURSE_CATEGORIES_API);
        // console.log("fetch course categoires api response...", response);
        result = response.data.data;
    } catch(err) {
        // console.log("Error in FETCH COURSE CATEGORIES API.....", err);
        toast.error(err.response.data.message);
    }

    return result;
}

export const addCourseDetails = async(data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            "POST", 
            CREATE_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data", // form with file inputs
                Authorization: `Bearer ${token}`
            },
        );

        console.log('ADD COURSE API Response.....', response);

        result = response.data.data;
        toast.success("Course Details Added Successfully")
    } catch(err) {
        // console.log("Add Course Details API error....",  err);
        toast.error("Can not create course");
    }

    toast.dismiss(toastId);
    return result;
}

export const editCourseDetails = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            "POST", 
            EDIT_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        );

        // console.log("edit course details API response...", response);
        result = response.data.data;
        toast.success("Course Details Updated Successfully")
    } catch(err) {
        // console.log("Edit course Details API error...", err);
        toast.error("Can not edit course");
    }

    toast.dismiss(toastId);
    return result;
}

export const createSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector(
            "POST",
            CREATE_SECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Create Section API response...", response);
        result = response?.data?.updatedCourse;
        toast.success("Course Section Created")
    } catch(err) {
        // console.log("Create Section API Error....", err);
        toast.error("Can not create section");
    }

    toast.dismiss(toastId);
    return result;
}

export const createSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "POST",
            CREATE_SUBSECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Create Sub Section API response...",response);
        result = response?.data?.data;
        toast.success("Lecture Added")
    } catch(err) {
        // console.log("Create Sub section API error...", err);
        toast.error("Can not create sub section");
    }

    toast.dismiss(toastId);
    return result;
}

export const updateSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    
    try {
        const response = await apiConnector(
            "PUT",
            UPDATE_SECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Update section API response...", response);
        result = response?.data?.data;
    } catch(err) {
        // console.log("Update section API error...", err);
        toast.error("Can not update section");
    }

    toast.dismiss(toastId);
    return result;
}

export const updateSubSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector(
            "POST",
            UPDATE_SUBSECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Update Sub Section API response...", response);
        result = response?.data?.data;
        toast.success("Course Section Updated")
    } catch(err) {
        // console.log("Update SUB Section API error...", err);
        toast.error("Can not update sub section");
    }

    toast.dismiss(toastId);
    return result;
}

export const deleteSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            "POST",
            DELETE_SECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log('Delete Section API response....', response);
        result = response?.data?.data;
        toast.success("Course Section deleted");
    } catch(err) {
        // console.log("Delete section API error...", err);
        // toast.error(err.response.data.message);
        toast.error("Can not delete section");
    }
    
    toast.dismiss(toastId);
    return result;
}

export const deleteSubSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            "POST",
            DELETE_SUBSECTION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Delete Sub Section API response...", response);
        result = response?.data?.data;
        toast.success("Lecture deleted");
    } catch(err) {
        // console.log("Delete Sub Section API error....", err);
        toast.error("Can not delete sub section");
    }

    toast.dismiss(toastId);
    return result;
}

export const fetchInstructorCourses = async (token) => {
    let result = [];
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "GET",
            GET_ALL_INSTRUCTOR_COURSES_API,
            null,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Fetch Instructor Course API response...", response);
        result = response?.data?.data;
    } catch(err) {
        // console.log("Fetch Instructor Course API error...", err);
        toast.error(err.response.data.message);
    }

    toast.dismiss(toastId);
    return result;
}

export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(
            "DELETE",
            DELETE_COURSE_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Delete Course API response...", response);
        toast.success("Course Deleted");
    } catch(err) {
        // console.log("Delte Course API error...", err);
        toast.error(err.response.data.message);
    }

    toast.dismiss(toastId);
}

export const getFullDetailsOfCourse = async (courseId, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector(
            "POST",
            GET_FULL_COURSE_DETAILS_AUTHENTICATED,
            {courseId},
            {Authorization: `Bearer ${token}`},
        );

        // console.log('GET_FULL_DETAILS_OF_COURSE API respone...', response);
        result = response?.data?.data;
    } catch(err) {
        // console.log("GET FULL DETAILS OF COURSE API error....", err);
        toast.error(err.response.data.message);
    }

    toast.dismiss(toastId);
    return result;
}

export const markLectureAsComplete = async (data, token) => {
    let success = false;
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "POST",
            LECTURE_COMPLETION_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log("MARK_LECTURE_AS_COMPLETE API response...", response);
        success = true;
        toast.success("Lecture completed");
    } catch(err) {
        // console.log("MARK_LECTURE_AS_COMPLETE API error...", err);
        toast.error(err.response.data.message);
        success = false;
    }

    toast.dismiss(toastId);
    return success;
}

export const createRating = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let success = false;
    try {
        const response = await apiConnector(
            "POST",
            CREATE_RATING_API,
            data,
            {Authorization: `Bearer ${token}`},
        );

        // console.log('CREATE_RATING API response...', response);

        success = true;
        toast.success('Rating created');
    } catch(err) {
        success = false;
        // console.log("CREATE_RATING API error...", err);
        toast.error(err.response.data.message);
    }

    toast.dismiss(toastId);
    return success;
}