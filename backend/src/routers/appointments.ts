import { Router } from "express";
import { add, addAppointment, getAll, getOne, getOneById, patch } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:company_id', getOneById);
router.post('/', add);
router.patch('/:company_id', patch)
router.patch('/new/:company_id', addAppointment)

export default router;