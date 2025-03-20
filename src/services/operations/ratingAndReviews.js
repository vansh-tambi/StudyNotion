import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { ratingsEndpoints } from "../apis";

export async function getRatingAndReviews() {
    try {
        const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);

        // console.log("REVIEWS DETAILS API response...", response);
        return response?.data?.data;
    } catch(err) {
        // console.log("REVIEWS DETAILS API error...", err);
        toast.error("Can't get rating & reviews");
    }
}