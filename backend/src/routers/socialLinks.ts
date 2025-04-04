import { Router } from "express";
import validate from "../middlewares/input-validation";
import { add, deleteSocial, getAll, getOne, patch } from "../controllers/socialLinks/controller";
import { addSocialValidator, patchSocialValidator } from "../controllers/socialLinks/validator";
import enforceAuth from "../middlewares/enforce-auth";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', enforceAuth, validate(addSocialValidator), add);
router.delete('/:id', enforceAuth, deleteSocial);
router.patch('/:id', enforceAuth, validate(patchSocialValidator), patch);
export default router;