import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        enum: ['Food', 'Travel', 'Rent', 'Utilities', 'Entertainment', 'Other', 'Business', 'Recharge', 'Billing', 'Subscription', 'Fee'],
        default: 'Other',
    },
    splitType: {
        type: String,
        enum: ['Equal', 'Percentage', 'Manual'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    paidBy: {
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
        }
    },
    participants: [
        {
            email: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                default: "",
            },
            share: {
                type: Number,
                required: true,
                min: 0,
            },
            paid: {
                type: Boolean,
                default: false,
            },
        },
    ],
    receiptImage: {
        type: String,
        default: ""
    },
}, { timestamps: true, versionKey: false });

export default mongoose.model("Expense", expenseSchema, "expenses");