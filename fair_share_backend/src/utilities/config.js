import dotenv from "dotenv"

dotenv.config()

export const USER_SECRATE_KEY = process.env.USER_SECRATE_KEY
export const CONNECTION_STRING = process.env.CONNECTION_STRING

export const PORT = process.env.PORT
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

export const StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    ALREADY_EXIST: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

export const Messages = {
    ALREADY_EXIST: "Already Exist!",
    AUTHORIZATION_TOKEN_MISSING: "Authorization Token is Missing or Invalid!",
    AUTHENTICATION_SUCCESS: "Authentication Successful!",
    FETCHED_SUCCESSFULLY: "Fetched Successfully.",
    CREATED_SUCCESSFULLY: "Created Successfully.",
    ADDED_SUCCESSFULLY: "Added Successfully.",
    UPDATED_SUCCESSFULLY: "Updated Successfully.",
    REGISTERED_SUCCESSFULLY: "Registered Successfully.",
    REGISTRATION_FAILED: "Registration Failed!",
    CREATION_FAILED: "Creation Failed!",
    UPDATION_FAILED: "Updation Failed!",
    SOMETHING_WENT_WRONG: "Something Went Wrong!",
    ERROR_OCCURRED: "Error Occurred in ",
    UNEXPECTED_ERROR: "Unexpected Error Occurred!",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or Expired Token!",
    PAYLOAD_MISSING_OR_INVALID: "User Payload is Missing or Invalid!",
    MISSING_OR_INVALID: "is Missing or Invalid!",
    THIS_NOT_FOUND: "Not Found or Inactive!",
    USER_NOT_FOUND: "User Not Found or Inactive!",
    ROLE_NOT_RECOGNIZED: "Role Not Recognized!",
    MISSING_REQUIRED_FIELD: "Missing Required Fields for Creation",
    SUBSCRIPTION_NOT_FOUND: "SUBSCRIPTION NOT FOUND",
    NO_CONTENT: "NO CONTENT FOUND",
    DATA_NOT_FOUND: "Data not found",
};

export const generateUniqueId = async (model, prefix) => {
    try {
        let lastEntry = await model.findOne().sort({ id: -1 });

        let newUniqueId = "";
        if (lastEntry && lastEntry.id) {
            const lastNumericPart = parseInt(lastEntry.id.replace(prefix, ""), 10);
            const nextId = lastNumericPart + 1;
            newUniqueId = `${prefix}${String(nextId).padStart(4, "0")}`;
        } else {
            newUniqueId = `${prefix}0001`;
        }
        console.log("newUniqueId ==>", newUniqueId);
        return newUniqueId;
    } catch (error) {
        console.error(`Error generating unique ID for ${prefix}:`, error);
        throw error;
    }
};
