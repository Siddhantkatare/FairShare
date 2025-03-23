import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, ToastProperty } from '../lib/config';

export const addExpense = async (token, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/expense`, data, {
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

export const getAllExpense = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/expense`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in getAllExpense", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in getAllExpense", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in getAllExpense", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in getAllExpense", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}