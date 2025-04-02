import { Router } from "express";
import validate from "../middlewares/input-validation";
import { addCardValidator } from "../controllers/cards/validator";
import { add, deleteCard, getAll, getOne, patch } from "../controllers/cards/controller";

const router = Router();

router.get('/', getAll);
router.get('/:company', getOne);
router.post('/', validate(addCardValidator), add);
router.delete('/:id', deleteCard);
router.patch('/:id', patch);
export default router;