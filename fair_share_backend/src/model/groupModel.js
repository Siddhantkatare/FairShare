import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
}, { _id: false, versionKey: false, timestamps: false });

const groupSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    createdBy: {
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
        }
    },
    members: [
        {
            email: {
                type: String,
                required: true,
            },
            userId: {
                type: String,
                default: ""
            },
            name: {
                type: String,
                default: ""
            },
        },
    ],
    expenses: {
        type: [String],
        default: [],
    },
    conversation: [conversationSchema],
}, { timestamps: true, versionKey: false });

export default mongoose.model("Group", groupSchema, "groups");