import axios from "axios";
import appConfig from "../utils/AppConfig";
import AppointmentsModel, { Appointment } from "../models/appointmentsModel";

class AppointmentsService {

    //============ Availability ===============
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


    public async addAvailability(app: AppointmentsModel): Promise<AppointmentsModel | null> {
        try {
            const response = await axios.post<{ app: AppointmentsModel }>(appConfig.appointmentsUrl, app);
            const newAppointment = response.data.app || null;
            return newAppointment;
        } catch (error: any) {
            console.error('Error adding appointment:', error);
            throw error;
        }
    }

    public async editAvailability(app: AppointmentsModel): Promise<AppointmentsModel> {
        try {
            const appointmentToSend = {
                ...app,
                days_schedule: JSON.stringify(app.days_schedule),
                booked_appointments: JSON.stringify(app.booked_appointments)
            };

            const response = await axios.patch<AppointmentsModel>(`${appConfig.appointmentsUrl}/${app.company_id}`, appointmentToSend);
            console.log("Response: ", response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // public async bookAppointment(company_id: string, newApp: any): Promise<AppointmentsModel> {
    //     try {
    //         const response = await axios.patch(`${appConfig.appointmentsUrl}/new/${company_id}`, {
    //             ...newApp,
    //             date: newApp.date
    //         });
    //         const data = response.data;
    //         return data;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    public async getAvailableTimes(company_id: string, selectedDate: string): Promise<string[]> {
        try {
            const response = await axios.get(`${appConfig.appointmentsUrl}/available/${company_id}`, {
                params: { date: selectedDate }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching available times:', error);
            throw error;
        }
    }


    //============ Appointments ===============
    public async getAllAppointments(): Promise<Appointment[]> {
        const response = await axios.get<Appointment[]>(`appConfig.appointmentsUrl/book`);
        return response.data;
    }

    public async getOneAppointments(id: string): Promise<Appointment | null> {
        try {
            const response = await axios.get<Appointment>(`${appConfig.appointmentsUrl}/book/${id}`);
            return response.data || null;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            return null;
        }
    }

    public async getAllByCompanyId(company_id: string): Promise<Appointment[]> {
        try {
            const response = await axios.get<Appointment[]>(`${appConfig.appointmentsUrl}/books/${company_id}`);
            return response.data || [];
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log(`No appointments found for company ${company_id}`);
                return [];
            }
            console.error('Error fetching appointments by company:', error);
            throw error;
        }
    }

    public async getOneAppByCompany(company_id: string): Promise<Appointment | null> {
        try {
            const response = await axios.get<Appointment>(`${appConfig.appointmentsUrl}/book/${company_id}`);
            return response.data || null;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log(`No appointments found for company ${company_id} - this is normal for new users`);
                return null;
            }

            console.error('Error fetching appointment by company:', error);
            throw error;
        }
    }

    public async bookNewAppointment(newApp: Omit<Appointment, "id">): Promise<Appointment> {
        try {
            const response = await axios.post<Appointment>(`${appConfig.appointmentsUrl}/book`, newApp);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    public async deleteAppointment(id: number): Promise<void> {
        await axios.delete(`${appConfig.appointmentsUrl}/book/${id}`);
    }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;