import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, ToastProperty } from '../lib/config';

export const addGroup = async (token, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/group`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in addGroup", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in addGroup", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in addGroup", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in addGroup", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}

export const getAllGroups = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/group`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log("Error in getAllGroups", error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Error in getAllGroups", error)
                toast.error(error.response.data.message, ToastProperty)
            } else {
                console.log("Error in getAllGroups", error)
                toast.error("Please try again later.", ToastProperty)
            }
        } else {
            console.log("Error in getAllGroups", error)
            toast.error("Please try again later.", ToastProperty)
        }
    }
}