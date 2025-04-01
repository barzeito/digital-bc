import { Router } from "express";
import validate from "../middlewares/input-validation";
import { loremIpsumValidator } from "../controllers/cards/validator";
import { add, deleteCard, getAll, getOne, patch } from "../controllers/socialLinks/controller";

const router = Router();

router.get('/', validate(loremIpsumValidator), getAll);
router.get('/:id', getOne);
router.post('/', add);
router.delete('/:id', deleteCard)
router.patch('/:id', patch)
export default router;