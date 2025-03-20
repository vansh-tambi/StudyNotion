import toast from "react-hot-toast";
import { cartEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setCart, setTotal, setTotalItems } from "../../slices/cartSlice";

const {
    ADD_TO_CART_API,
    REMOVE_FROM_CART_API,
    GET_CART_DETAILS_API,
} = cartEndpoints;


export const addItemToCart = async (cartId, courseId, token) => {
    const toastId = toast.loading("Loading...");

    try {
        await apiConnector(
            "POST",
            ADD_TO_CART_API,
            {cartId, courseId},
            {Authorization: `Bearer ${token}`}
        );
        
        toast.success("Course added to cart");
    } catch(err) {
        // console.log("ADD TO CART API error....", err);
        toast.error("Can't add item to the cart");
    }

    toast.dismiss(toastId);
}

export const removeItemFromCart = async (cartId, courseId, token, dispatch, buyingFromCatalogPage) => {
    const toastId = toast.loading("Loading...");
    try {
        await apiConnector(
            "POST",
            REMOVE_FROM_CART_API,
            {cartId, courseId},
            {Authorization: `Bearer ${token}`},
        );

    // update cart slice
    const cartData = await getFullCartDetails(cartId, token);

    dispatch(setTotalItems(cartData?.length || 0));

    const totalPrice = cartData.reduce((acc, course) => {
        return acc += course.price;
    }, 0);
    dispatch(setTotal(totalPrice));
    dispatch(setCart(cartData));

        // if call was made from catalog page then 
        // it may be possible that user is buying course without adding it to cart
        // so don't show the toast
        if(!buyingFromCatalogPage) {
            toast.success("Course removed from cart");
        }
    } catch(err) {
        // console.log("REMOVE FROM CART API error....", err);

        // if call was made from catalog page then 
        // it may be possible that user is buying course without adding it to cart
        // so don't show the toast
        if(!buyingFromCatalogPage) {
            toast.error("Can't remove item from cart");
        }
    }

    toast.dismiss(toastId);
}

export const getFullCartDetails = async (cartId, token) => {
    let result = [];
    try {
        const response = await apiConnector(
            "POST",
            GET_CART_DETAILS_API,
            {cartId},
            {Authorization: `Bearer ${token}`},
        );

        // console.log("Logging GET FULL CART DETAILS response...", response);

        result = response?.data?.data?.courses;
    } catch(err) {
        // console.log("GET FULL CART DETAILS API error...", err);
        toast.error("Can't get cart details");
    }

    return result;
}