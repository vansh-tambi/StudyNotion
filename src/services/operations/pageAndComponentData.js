import toast from 'react-hot-toast';

import { apiConnector } from '../apiConnector';
import { catalogData } from '../apis';

export const getCategoryPageData = async (categoryId) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  
  try {
    const response = await apiConnector(
        "POST",
        catalogData.CATALOGPAGEDATA_API,
        {categoryId: categoryId},
    );

    // console.log("GET CATEGORY PAGE DATA API response......", response);

    if(!response?.data?.success) {
        throw new Error("Could not fetch category data");
    }

    result = response?.data;
  } catch(err) {
    // console.log("GET CATEGORY PAGE DATA API error...", err);
    toast.error(err.message);
    result = err.response?.data;
  }

  toast.dismiss(toastId);
  return result;
}