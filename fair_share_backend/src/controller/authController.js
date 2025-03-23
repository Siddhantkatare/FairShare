import jwt from 'jsonwebtoken';
import { generateUniqueId, Messages, StatusCodes, USER_SECRATE_KEY } from '../utilities/config.js';
import userModel from '../model/userModel.js';

export const authJWT = (request, response, next) => {
    try {
        // console.log("request.headers.authorization", request.headers.authorization);
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("Token is required or Invalid Token")
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token", success: false });
        }
        const token = authHeader.split(" ")[1];
        // console.log("Authorization Token ==> ", token);

        const payload = jwt.decode(token)
        // console.log("payload ==> ", payload);
        if (!payload) {
            console.error("Invalid Token")
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token", success: false });
        }

        let secrateKey = USER_SECRATE_KEY

        if (!secrateKey) {
            console.error("invalid roleId")
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token", success: false });
        }

        //Token Verify
        const verifiedPayload = jwt.verify(token, secrateKey)
        request.payload = verifiedPayload;

        next();
    } catch (error) {
        console.error("Error in authJWT");
        console.error("Token has expired or invalid");
        return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Token has expired or invalid" });
    }
}

export const signUpController = async (request, response) => {
    try {
        const { name, email, contactNumber, password } = request.body;

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            console.log("Email already exists")
            return response.status(StatusCodes.ALREADY_EXIST).json({ success: false, message: "Email Already Exist" })
        }

        const newId = await generateUniqueId(userModel, "USER")
        const newUser = await userModel.create({ id: newId, name, email, contactNumber, password });
        if (!newUser) {
            console.log("Failed to create account")
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
        }

        return response.status(StatusCodes.OK).json({ success: true, message: "Account created successfully, please login" })
    } catch (error) {
        console.log("Error in signUpController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}

export const loginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await userModel.findOne({ email: email }).lean();
        if (!user) {
            console.log("User not found")
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid email" })
        }

        if (password === user.password) {
            let secrateKey = USER_SECRATE_KEY
            const token = jwt.sign(user, secrateKey, { expiresIn: '1d' })
            console.log("Generated Token ===> ", token)
            return response.status(StatusCodes.CREATED).json({ success: true, message: "Login successful", userData: { ...user, token } })
        } else {
            console.log("Wrong password")
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Wrong password" })
        }
    } catch (error) {
        console.log("Error in loginController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}