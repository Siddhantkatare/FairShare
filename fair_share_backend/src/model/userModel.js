import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    group: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("User", userSchema, "users");