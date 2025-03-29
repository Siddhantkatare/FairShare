import axios from "axios"
import { API_BASE_URL, ToastProperty } from "../lib/config"
import { toast } from "react-toastify"

export const createPayment = async (token, id, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/order/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in addExpense", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in addExpense", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in addExpense", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in addExpense", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}

export const verifyPayment = async (token, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/verify`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in verifyPayment", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in verifyPayment", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in verifyPayment", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in verifyPayment", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}