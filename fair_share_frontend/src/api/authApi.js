import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, ToastProperty } from '../lib/config';

export const signUp = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signUp`, data)
        return response.data;
    } catch (error) {
        console.log("Error in signUp", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in signUp", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in signUp", error)
                toast.error("Failed to sign up. Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in signUp", error)
            toast.error("Failed to sign up. Please try again later.", ToastProperty)
        }
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, data)
        return response.data;
    } catch (error) {
        console.log("Error in login", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in login", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in login", error)
                toast.error("Failed to sign up. Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in login", error)
            toast.error("Failed to sign up. Please try again later.", ToastProperty)
        }
    }
}

export const getProfile = async (token, id) => {
    try {
        const response = await axios.get(`${API_URL}/profile/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in getProfile", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in getProfile", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in getProfile", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in getProfile", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}

export const updateProfile = async (token, id, data) => {
    try {
        const response = await axios.put(`${API_URL}/profile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in getProfile", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in getProfile", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in getProfile", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in getProfile", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}
