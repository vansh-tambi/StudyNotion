import { apiConnector } from "../apiConnector";
import { contactusEndpoint } from "../apis";
import toast from "react-hot-toast";

export async function contactUs(setLoading, data) {
    setLoading(true);
    const toastId = toast.loading("Loading...");

    try {
      const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
      // console.log('Logging CONTACT US API response...', response);
      setLoading(false);
      toast.success('Message sent successfully');
    } catch(err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response.data.message);
    }
    
    toast.dismiss(toastId);
  }