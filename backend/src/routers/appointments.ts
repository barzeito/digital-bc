import { Router } from "express";
import { add, addAppointment, deleteAppointment, getAll, getAllAppointments, getAllAppsByCompany, getAppAvailable, getAvailableTimes, getOne, getOneAppByCompany, getOneAppointment, getOneById, patch, setAppAvailable, updateAppointment } from "../controllers/appointments/controller";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:company_id', getOneById);
router.get('/times/:company_id', getAvailableTimes);
router.post('/', add);
router.patch('/:company_id', patch);
router.patch('/new/:company_id', addAppointment);

router.get('/book/', getAllAppointments);
router.get('/book/:id', getOneAppointment);
router.get('/books/:company_id', getAllAppsByCompany);
router.get('/book/:company_id', getOneAppByCompany);
router.post('/book/', addAppointment);
router.delete('/book/:id', deleteAppointment);
router.patch('/book/:id', updateAppointment);
router.patch('/available/:company_id', setAppAvailable);
router.get('/available/:company_id', getAppAvailable);



export default router;