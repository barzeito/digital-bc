import { Router } from "express";
import validate from "../middlewares/input-validation";
import { getAll, getOne, patch } from "../controllers/socialLinks/controller";
import { patchSocialValidator } from "../controllers/socialLinks/validator";
import enforceAuth from "../middlewares/enforce-auth";

const router = Router();

router.get('/', getAll);
router.get('/:company_id', getOne);
router.patch('/:company_id', enforceAuth, validate(patchSocialValidator), patch);
export default router;