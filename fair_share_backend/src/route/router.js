import express from 'express';
import { authJWT, loginController, signUpController } from '../controller/authController.js';
import { getProfileController, updateProfileController } from '../controller/userController.js';
const router = express.Router();

router.post('/signUp', signUpController)
router.post('/login', loginController)

router.use(authJWT)

router.get('/profile/:id', getProfileController)
router.post('/profile/:id', updateProfileController)


export default router;