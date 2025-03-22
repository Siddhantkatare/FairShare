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
    date: {
        type: Date,
        default: Date.now,
    },
    paidBy: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    participants: [
        {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            share: {
                type: Number,
                required: true,
                min: 0,
            },
            settled: {
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