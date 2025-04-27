import { Router } from "express";
import { deleteUser, forgotPassword, getAll, getOne, isAdmin, isPremium, patchPassword, patchUser, resetPassword, signIn, signUp } from "../controllers/auth/controller";
import validate from "../middlewares/input-validation";
import { forgotPasswordValidator, signInValidator, signUpValidator, updatePasswordValidator } from "../controllers/auth/validator";
import enforceAdmin from "../middlewares/enforce-admin";
import enforceAuth from "../middlewares/enforce-auth";

const router = Router();

router.get('/users', getAll);
router.get('/users/:id', getOne);
router.post('/signup', validate(signUpValidator), signUp);
router.post('/signin', validate(signInValidator), signIn);
router.patch('/change-password/:id', validate(updatePasswordValidator), patchPassword);
router.post('/forgot-Password', validate(forgotPasswordValidator), forgotPassword);
router.patch('/reset-password', resetPassword);
router.get('/role/:id', isAdmin);
router.get('/premium/:id', isPremium);
router.delete('/users/:id', enforceAdmin, deleteUser);
router.patch('/users/:id',patchUser);



export default router;