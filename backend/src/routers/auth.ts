import { Router } from "express";
import { forgotPassword, isAdmin, patchPassword, signIn, signUp } from "../controllers/auth/controller";
import validate from "../middlewares/input-validation";
import { forgotPasswordValidator, signInValidator, signUpValidator, updatePasswordValidator } from "../controllers/auth/validator";

const router = Router();

router.post('/signup', validate(signUpValidator), signUp);
router.post('/signin', validate(signInValidator), signIn);
router.patch('/change-password/:id', validate(updatePasswordValidator), patchPassword);
router.post('/forgot-Password/:id', validate(forgotPasswordValidator), forgotPassword);
router.get('/role/:id', isAdmin);



export default router;