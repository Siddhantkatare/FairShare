import { Messages, StatusCodes, } from '../utilities/config.js';
import userModel from '../model/userModel.js';


export const getProfileController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }
        const { id } = request.params;
        const user = await userModel.findOne({ id: id }).lean();
        if (!user) {
            console.log("User not found")
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid id" })
        }
        return response.status(StatusCodes.OK).json({ user, success: true, message: "Profile Fetched Successfully" })
    } catch (error) {
        console.log("Error in getUserProfileController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}

export const updateProfileController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }
        const { name, email, password, contactNumber, organizationId, image, courseId, grade, city, state, address, isActive } = request.body;
        const { id } = request.params;

        const user = await userModel.findOne({ id: id });
        if (!user) {
            console.log("User not found")
            return response.status(StatusCodes.NO_CONTENT).json({ success: false, message: "User not found" })
        }

        if (name && user.name !== name) {
            user.name = name;
        }
        if (email && user.email !== email) {
            user.email = email;
        }
        if (password && user.password !== password) {
            user.password = password;
        }
        if (contactNumber && user.contactNumber !== contactNumber) {
            user.contactNumber = contactNumber;
        }
        if (image && user.image !== image) {
            user.image = image;
        }
        if (city && user.city !== city) {
            user.city = city;
        }
        if (state && user.state !== state) {
            user.state = state;
        }
        if (address && user.address !== address) {
            user.address = address;
        }
        // function areArraysEqual(arr1, arr2) {
        //     if (arr1.length !== arr2.length) return false;
        //     const sortedArr1 = [...arr1].sort();
        //     const sortedArr2 = [...arr2].sort();

        //     return sortedArr1.every((value, index) => value === sortedArr2[index]);
        // }
        // if (group && !areArraysEqual(group, user.group)) {
        //     user.group = recipientType === "self" ? [email] : group;
        // }
        const userUpdated = await user.save();
        if (userUpdated) {
            console.log("User updated successfully")
            return response.status(StatusCodes.OK).json({ success: true, message: "Profile updated successfully" })
        }
        return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    } catch (error) {
        console.log("Error in updateProfileController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}