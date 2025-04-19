import { Router } from "express";
import { add, getAll, getOne } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', add);
export default router;