import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Messages, RAZORPAY_KEY_ID, RAZORPAY_SECRET, StatusCodes } from "../utilities/config.js";
import paymentModel from '../model/paymentModel.js';


const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});

export const createPaymentController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }

        const { amount } = request.body;

        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log("Error in createPaymentController ==>", error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.SOMETHING_WENT_WRONG });
            }
            return response.status(StatusCodes.OK).json({ success: true, data: order, message: "Payment Successfull" });
        });

        // return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    } catch (error) {
        console.log("Error in createPaymentController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}

export const verifyPaymentController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }

        const { orderId, paymentId, signature } = request.body;
        console.log("request.body ==>", request.body);

        const sign = orderId + "|" + paymentId;
        console.log("sign ==>", sign);

        const expectedSign = crypto.createHmac("sha256", RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");
        console.log("expectedSign ==>", expectedSign);

        const isAuthentic = expectedSign === signature;
        console.log("isAuthentic ==>", isAuthentic);

        if (isAuthentic) {
            const payment = await paymentModel.create({
                orderId,
                paymentId,
                signature
            });
            console.log("payment ==>", payment);

            if (payment) {
                return response.status(StatusCodes.OK).json({
                    success: true, message: "Payement Successfull"
                });
            }
        }

        return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    } catch (error) {
        console.log("Error in verifyPaymentController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}  