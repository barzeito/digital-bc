import { Router } from "express";
import { add, addAppointment, deleteAppointment, getAll, getAllAppointments, getAllAppsByCompany, getAppAvailable, getAvailableTimes, getOne, getOneAppByCompany, getOneAppointment, getOneById, patch, setAppAvailable, updateAppointment } from "../controllers/appointments/controller";
import { sendContactEmail } from "../utils/emailService";

const router = Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  const adminEmail = 'bar199234@gmail.com';
  const subject = 'צור קשר';

  sendContactEmail(adminEmail, name, email, subject, message)
    .then(() => {
      res.send('Email sent successfully!');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error sending email');
    });
});

export default router;