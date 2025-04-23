export type Appointment = {
    name: string;
    email: string;
    phone: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
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