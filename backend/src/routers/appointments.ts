import { Router } from "express";
import { add, addAppointment, getAll, getAvailableTimes, getOne, getOneById, patch } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:company_id', getOneById);
router.get('/available/:company_id', getAvailableTimes);
router.post('/', add);
router.patch('/:company_id', patch)
router.patch('/new/:company_id', addAppointment)

export default router;