import expenseModel from "../model/expenseModel.js";
import { generateUniqueId, Messages, StatusCodes } from "../utilities/config.js";


// export const addExpenseController = async (request, response) => {
//     try {
//         if (!request.payload) {
//             return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
//         }
//         const { amount, description, category, date, paidBy, participants } = request.body;

//         if (!participants || participants.length <= 1) {
//             return response.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Participants should be more than one" });
//         }

//         const totalShares = participants.reduce((sum, participant) => sum + participant.share, 0);

//         const isAmountValid = Math.abs(totalShares - amount) < 0.01;

//         if (!isAmountValid) {
//             return response.status(StatusCodes.BAD_REQUEST).json({
//                 success: false,
//                 message: `The sum of shares does not match the expense amount (${amount})`
//             });
//         }

//         const newId = await generateUniqueId(expenseModel, "EXP")
//         const newExpense = await expenseModel.create({ id: newId, amount, description, category, date, paidBy, participants });
//         if (newExpense) {
//             return response.status(StatusCodes.OK).json({ success: true, message: "Expense added successfully" })
//         }
//         console.log("Failed to create expense")
//         return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })

//     } catch (error) {
//         console.log("Error in addExpenseController", error)
//         return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
//     }
// }

export const addExpenseController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: Messages.PAYLOAD_MISSING_OR_INVALID });
        }

        const { amount, description, category, date, paidBy, participants, splitType } = request.body;

        if (!participants || participants.length <= 1) {
            return response.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Participants should be more than one" });
        }

        const invalidParticipants = participants.filter(
            participant => participant.email === paidBy.email ? participant.paid !== true : participant.paid !== false
        );

        if (invalidParticipants.length > 0) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Only the payer should have 'paid: true'. All other participants must have 'paid: false'."
            });
        }

        let totalShares = 0;

        switch (splitType) {
            case "Equal":
                const equalShare = amount / participants.length;
                for (const participant of participants) {
                    if (Math.abs(participant.share - equalShare) > 0.01) {
                        return response.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            message: `Invalid share for participant ${participant.email}. Expected: ${equalShare}, Provided: ${participant.share}`
                        });
                    }
                    totalShares += participant.share;
                }
                break;
            case "Percentage":
                totalShares = participants.reduce((sum, participant) => sum + participant.share, 0);
                if (Math.abs(totalShares - 100) > 0.01) {
                    return response.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: `The sum of percentages (${totalShares}) must equal 100`
                    });
                }

                for (const participant of participants) {
                    const calculatedShare = (participant.share / 100) * amount;
                    participant.share = calculatedShare;
                    totalShares += calculatedShare;
                }
                break;
            case "Manual":
                totalShares = participants.reduce((sum, participant) => sum + participant.share, 0);
                if (Math.abs(totalShares - amount) > 0.01) {
                    return response.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: `The sum of shares (${totalShares}) does not match the expense amount (${amount})`
                    });
                }
                break;

            default:
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid split type. Use 'Equal', 'Percentage', or 'Manual'"
                });
        }

        const newId = await generateUniqueId(expenseModel, "EXP");

        const newExpense = await expenseModel.create({
            id: newId,
            amount,
            description,
            category,
            date,
            paidBy,
            participants,
            splitType
        });

        if (newExpense) {
            return response.status(StatusCodes.OK).json({ success: true, message: "Expense added successfully" });
        }

        console.log("Failed to create expense");
        return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: Messages.SOMETHING_WENT_WRONG });

    } catch (error) {
        console.log("Error in addExpenseController", error);
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG });
    }
};

export const getAllExpenseController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: Messages.PAYLOAD_MISSING_OR_INVALID })
        }
        const allExpenses = await expenseModel.find().sort({ id: -1 });
        if (!allExpenses) {
            console.log("Failed to getAllExpense")
            return response.status(StatusCodes.NO_CONTENT).json({ success: false, message: Messages.DATA_NOT_FOUND })
        }
        return response.status(StatusCodes.OK).json({ allExpenses, success: true, message: "Expenses Fetched Successfully" })
    } catch (error) {
        console.log("Error in getAllExpenseController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}

export const updateExpenseController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: Messages.PAYLOAD_MISSING_OR_INVALID });
        }

        const { id } = request.params;
        const { amount, description, category, date, paidBy, participants, splitType } = request.body;

        const existingExpense = await expenseModel.findOne({ id: id });
        if (!existingExpense) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Expense not found" });
        }

        if (!participants || participants.length <= 1) {
            return response.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Participants should be more than one" });
        }

        const invalidParticipants = participants.filter(
            participant => participant.email === paidBy.email ? participant.paid !== true : participant.paid !== false
        );

        if (invalidParticipants.length > 0) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Only the payer should have 'paid: true'. All other participants must have 'paid: false'."
            });
        }

        let totalShares = 0;

        switch (splitType) {
            case "Equal":
                const equalShare = amount / participants.length;
                for (const participant of participants) {
                    if (Math.abs(participant.share - equalShare) > 0.01) {
                        return response.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            message: `Invalid share for participant ${participant.email}. Expected: ${equalShare}, Provided: ${participant.share}`
                        });
                    }
                    totalShares += participant.share;
                }
                break;

            case "Percentage":
                totalShares = participants.reduce((sum, participant) => sum + participant.share, 0);
                if (Math.abs(totalShares - 100) > 0.01) {
                    return response.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: `The sum of percentages (${totalShares}) must equal 100`
                    });
                }

                for (const participant of participants) {
                    const calculatedShare = (participant.share / 100) * amount;
                    participant.share = calculatedShare;
                    totalShares += calculatedShare;
                }
                break;

            case "Manual":
                totalShares = participants.reduce((sum, participant) => sum + participant.share, 0);
                if (Math.abs(totalShares - amount) > 0.01) {
                    return response.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: `The sum of shares (${totalShares}) does not match the expense amount (${amount})`
                    });
                }
                break;

            default:
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid split type. Use 'Equal', 'Percentage', or 'Manual'"
                });
        }

        const updatedExpense = await expenseModel.updateOne(
            { id: id },
            {
                amount,
                description,
                category,
                date,
                paidBy,
                participants,
                splitType
            },
            { new: true }
        );

        if (updatedExpense) {
            return response.status(StatusCodes.OK).json({ success: true, message: "Expense updated successfully", data: updatedExpense });
        }

        console.log("Failed to update expense");
        return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: Messages.SOMETHING_WENT_WRONG });

    } catch (error) {
        console.log("Error in updateExpenseController", error);
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG });
    }
};

export const getExpenseByIdController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }
        const { id } = request.params;
        const expense = await expenseModel.findOne({ id: id }).lean();
        if (!expense) {
            console.log("Expense not found")
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid id" })
        }
        return response.status(StatusCodes.OK).json({ expense, success: true, message: "Expense Fetched Successfully" })
    } catch (error) {
        console.log("Error in getExpenseByIdController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}