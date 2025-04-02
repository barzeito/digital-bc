import { Router } from "express";
import { signIn, signUp } from "../controllers/auth/controller";
import validate from "../middlewares/input-validation";
import { signInValidator, signUpValidator } from "../controllers/auth/validator";

const router = Router();

router.post('/signup', validate(signUpValidator), signUp);
router.post('/signin', validate(signInValidator), signIn);

export default router;