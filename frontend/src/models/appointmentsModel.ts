export type Appointment = {
    id: number;
    company_id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string; 
    message?: string;
};

export default class AppointmentsModel {
    appId?: string;
    company_id?: string;
    company?: string;
    days_schedule?: Record<string, { start: string; end: string }>;
    slot_interval?: number;
    booked_appointments?: Appointment[];
}