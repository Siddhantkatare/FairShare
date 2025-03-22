import mongoose from "mongoose";
import { CONNECTION_STRING } from "./config.js";

export const connectDB = async () => {
    try {
        const result = await mongoose.connect(CONNECTION_STRING);
        if (result) {
            console.log("Database connection successful");
        }
    } catch (error) {
        console.error("Error while connecting with Database ..!", error);
    }
};