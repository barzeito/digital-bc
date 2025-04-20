export default class AppointmentsModel {
    appId?: string;
    company_id?: string;
    company?: string;
    days_schedule?: Record<string, { start: string; end: string }>;
    slot_interval?: number;
}