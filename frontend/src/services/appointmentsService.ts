import axios from "axios";
import { CardsAction, CardsActionType, CardsStore } from "../redux/cardState";
import appConfig from "../utils/AppConfig";
import AppointmentsModel from "../models/appointmentsModel";

class AppointmentsService {

    public async getAll(): Promise<AppointmentsModel[]> {
        const response = await axios.get<{ apps: AppointmentsModel[] }>(appConfig.appointmentsUrl);
        const appointments = response.data.apps || response.data;
        return appointments;
    }

    public async getOne(id: string): Promise<AppointmentsModel | null> {
        try {
            const response = await axios.get<{ app: AppointmentsModel }>(`${appConfig.appointmentsUrl}/${id}`);
            const appointment = response.data.app || null;
            return appointment;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            return null;
        }
    }


    public async add(app: AppointmentsModel): Promise<AppointmentsModel | null> {
        try {
            const response = await axios.post<{ app: AppointmentsModel }>(appConfig.appointmentsUrl, app);
            const newAppointment = response.data.app || null;
            return newAppointment;
        } catch (error) {
            console.error('Error adding appointment:', error);
            return null;
        }
    }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;