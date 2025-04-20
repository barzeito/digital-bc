import { Router } from "express";
import { add, getAll, getOne, getOneById, patch } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:company_id', getOneById);
router.post('/', add);
router.patch('/:id', patch)
export default router;