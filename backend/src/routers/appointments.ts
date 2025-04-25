import { Router } from "express";
import { add, addAppointment, deleteAppointment, getAll, getAllAppointments, getAllAppsByCompany, getAvailableTimes, getOne, getOneAppByCompany, getOneAppointment, getOneById, patch } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:company_id', getOneById);
router.get('/available/:company_id', getAvailableTimes);
router.post('/', add);
router.patch('/:company_id', patch);
router.patch('/new/:company_id', addAppointment);

router.get('/book/', getAllAppointments);
router.get('/book/:id', getOneAppointment);
router.get('/books/:company_id', getAllAppsByCompany);
router.get('/book/:company_id', getOneAppByCompany);
router.post('/book/', addAppointment);
router.delete('/book/:id', deleteAppointment);

export default router;