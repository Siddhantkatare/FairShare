export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const SOCKET_URL = import.meta.env.VITE_BASE_URL

export const ToastMessages = {
    CAN_NOT_CREATE: "Unable to create at the moment. Kindly refresh or try again later.",
    CAN_NOT_FETCH: "Unable to fetch data at the moment. Kindly refresh or try again later.",
    CAN_NOT_UPDATE: "Unable to update at the moment. Please refresh or try again later.",
    CREATED_SUCCESSFULLY: "Created Successfully",
    UPDATED_SUCCESSFULLY: "Updated Successfully",
}

export const ToastProperty = {
    theme: "colored",
    position: "bottom-right",
}

export const Status = {
    CLOSED: "Closed",
    RESOLVED: "Resolved",
    PENDING: "Pending",
    INPROGRESS: "In-progress",
    CANCELLED: "Cancelled"
}

export const loggedData = () => {
    const loginData = localStorage.getItem('loginData');
    return JSON.parse(loginData) || null;
}