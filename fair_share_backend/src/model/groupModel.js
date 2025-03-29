import mongoose from "mongoose"

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
        type: String,
        required: true,
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
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Group", groupSchema, "groups");