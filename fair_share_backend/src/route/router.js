import express from 'express';
import { authJWT, loginController, signUpController } from '../controller/authController.js';
const router = express.Router();

router.post('/signUp', signUpController)
router.post('/login', loginController)

router.use(authJWT)


export default router;