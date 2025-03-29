import express from 'express';
import { authJWT, loginController, signUpController } from '../controller/authController.js';
import { getProfileController, updateProfileController } from '../controller/userController.js';
import { addExpenseController, getAllExpenseController, getExpenseByIdController, updateExpenseController } from '../controller/expenseController.js';
import { addGroupController, getAllGroupController, getGroupByIdController, pushMessgeToGroupController, updateGroupController } from '../controller/groupController.js';
import { createPaymentController, verifyPaymentController } from '../controller/paymentController.js';
const router = express.Router();

router.post('/signUp', signUpController)
router.post('/login', loginController)

router.use(authJWT)

router.get('/profile/:id', getProfileController)
router.post('/profile/:id', updateProfileController)

router.post('/expense', addExpenseController)
router.get('/expense', getAllExpenseController)
router.put('/expense/:id', updateExpenseController)
router.get('/expense/:id', getExpenseByIdController)

router.post('/group', addGroupController)
router.put('/group/:id', updateGroupController)
router.get('/group', getAllGroupController)
router.get('/group/:id', getGroupByIdController)
router.get('/group/:id', getGroupByIdController)
router.post('/group/:id', pushMessgeToGroupController)

router.post('/payment/order/:id', createPaymentController)
router.post('/payment/verify', verifyPaymentController)

export default router;