import { Router } from "express";
import validate from "../middlewares/input-validation";
import { addCardValidator, patchCardValidator } from "../controllers/cards/validator";
import { add, deleteCard, getAll, getOne, patch } from "../controllers/cards/controller";
import enforceAdmin from "../middlewares/enforce-admin";
import enforceAuth from "../middlewares/enforce-auth";
import { signUpValidator } from "../controllers/auth/validator";

const router = Router();

router.get('/', getAll);
router.get('/:company', getOne);
router.post('/', enforceAdmin, validate(addCardValidator), add);
router.delete('/:id', enforceAdmin, deleteCard);
router.patch('/:id', enforceAuth, validate(patchCardValidator), patch);
export default router;