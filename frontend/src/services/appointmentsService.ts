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

    public async getOneByCompanyId(company_id: string): Promise<AppointmentsModel | null> {
        try {
            const response = await axios.get<AppointmentsModel>(`${appConfig.appointmentsUrl}/${company_id}`);
            return response.data || null;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log(`No appointments found for company ${company_id} - this is normal for new users`);
                return null;
            }

            console.error('Error fetching appointment:', error);
            throw error;
        }
    }


    public async add(app: AppointmentsModel): Promise<AppointmentsModel | null> {
        try {
            const response = await axios.post<{ app: AppointmentsModel }>(appConfig.appointmentsUrl, app);
            const newAppointment = response.data.app || null;
            return newAppointment;
        } catch (error: any) {
            console.error('Error adding appointment:', error);
            throw error;
        }
    }

    public async editApps(app: AppointmentsModel): Promise<AppointmentsModel> {
        try {
            const appointmentToSend = {
                ...app,
                days_schedule: JSON.stringify(app.days_schedule)
            };

            const response = await axios.patch<AppointmentsModel>(`${appConfig.appointmentsUrl}/${app.appId}`, appointmentToSend);
            return response.data;
        } catch (error) {
            throw error;
        }

    }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;