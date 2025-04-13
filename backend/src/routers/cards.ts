import { Router } from "express";
import validate from "../middlewares/input-validation";
import { addCardValidator, patchCardValidator } from "../controllers/cards/validator";
import { add, assignCardOwner, deleteCard, getAll, getOne, getOneById, getUserCards, patch } from "../controllers/cards/controller";
import enforceAdmin from "../middlewares/enforce-admin";
import enforceAuth from "../middlewares/enforce-auth";

const router = Router();

router.get('/', getAll);
router.get('/:company', getOne);
router.get('/:id', getOneById);
router.get('/userCards/:userId', getUserCards);
router.post('/', enforceAdmin, validate(addCardValidator), add);
router.delete('/:id', enforceAdmin, deleteCard);
router.patch('/:id', enforceAuth, patch);
router.patch('/assign-owner/:id', enforceAdmin, assignCardOwner);
export default router;