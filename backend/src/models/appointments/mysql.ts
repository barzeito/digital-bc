import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";
import BookDTO from "./bookDTO";
import { sendAppointmentConfirmationEmail, sendAppointmentToCompanyEmail } from "../../utils/emailService";

class Appointments implements Model {

    // ============ Appointments Menage =============
    public async getAll(): Promise<DTO[]> {
        const apps = (await query(`
            SELECT  a.appId,
                    a.company_id,
                    a.company,
                    a.days_schedule,
                    a.slot_interval,
                    a.booked_appointments,
                    bc.company
            FROM    app_availability a
            LEFT JOIN business_cards bc ON a.company_id = bc.id 
            ORDER BY bc.company ASC
        `,));
        if (apps && typeof apps.days_schedule && apps.booked_appointments === 'string') {
            apps.days_schedule = JSON.parse(apps.days_schedule);
            apps.booked_appointments = JSON.parse(apps.booked_appointments);
        }
        return apps;
    }

    public async getOne(id: string): Promise<DTO> {
        const app = (await query(`
            SELECT  appId,
                    company_id,
                    company,
                    days_schedule,
                    slot_interval,
                    booked_appointments
            FROM    app_availability 
            WHERE   appId = ?
        `, [id]))[0];

        if (app && typeof app.days_schedule === 'string') {
            app.days_schedule = JSON.parse(app.days_schedule);
        }

        return app;
    }

    public async getOneByCompanyId(id: string): Promise<DTO> {
        const app = (await query(`
            SELECT  appId,
                    company_id,
                    company,
                    days_schedule,
                    slot_interval,
                    booked_appointments
            FROM    app_availability 
            WHERE   company_id = ?
        `, [id]))[0];

        if (app && typeof app.days_schedule === 'string') {
            app.days_schedule = JSON.parse(app.days_schedule);
        }

        return app;
    }

    public async add(app: DTO): Promise<DTO> {
        const { company_id, company, days_schedule, slot_interval, booked_appointments } = app;
        const appId = v4();
        const daysScheduleString = JSON.stringify(days_schedule);
        const addApp: OkPacketParams = await query(`
            INSERT INTO app_availability (appId, company_id, company, days_schedule, slot_interval, booked_appointments)
            VALUES (?, ?, ?, ?, ?, ?)
            `, [appId, company_id, company, daysScheduleString, slot_interval, booked_appointments]);
        return this.getOne(appId);
    }

    public async update(app: DTO): Promise<DTO> {
        const { appId, company_id, company, days_schedule, slot_interval, booked_appointments } = app;
        const updated = await query(`
                UPDATE  app_availability
                SET     company_id = ?,
                        company = ?,
                        days_schedule = ?,
                        slot_interval = ?,
                        booked_appointments = ?
                WHERE   company_id = ?
            `, [company_id, company, days_schedule, slot_interval, booked_appointments, company_id]);
        return this.getOneByCompanyId(company_id);
    }

    public async addBookedAppointment(companyId: string, date: string, appointment: any): Promise<void> {
        if (!date) {
            throw new Error("תאריך אינו מוגדר - לא ניתן לעדכן את ההזמנה");
        }

        const appointmentObject = {
            name: appointment.name,
            email: appointment.email,
            phone: appointment.phone,
            date: appointment.date,
            time: appointment.time,
            message: appointment.message,
            appointmentDate: date
        };

        const updateQuery = `
            UPDATE app_availability
            SET booked_appointments = JSON_ARRAY_APPEND(
                COALESCE(booked_appointments, '[]'),
                '$',
                ?
            )
            WHERE company_id = ?
        `;

        const params = [
            JSON.stringify(appointmentObject),
            companyId
        ];

        const result = await query(updateQuery, params);
        console.log('SQL result:', result);

        if (result.changedRows === 0) {
            console.warn("⚠️ לא עודכנה אף שורה - בדוק שה-company_id קיים:", companyId);
        }
    }

    // public async getAvailableTimes(company_id: string): Promise<any> {
    //     const app = await query(`
    //             SELECT  days_schedule,
    //                     slot_interval
    //             FROM    app_availability
    //             WHERE   company_id = ?
    //         `, [company_id]);
    //     return app
    // }

    public async getAvailableTimes(company_id: string): Promise<any> {
        // שליפת זמינות החברה
        const [availability] = await query(`
            SELECT days_schedule, slot_interval
            FROM app_availability
            WHERE company_id = ?
        `, [company_id]);

        if (!availability) {
            throw new Error('Company availability not found');
        }

        // שליפת תורים של החברה
        const appointments = await query(`
            SELECT date, time
            FROM appointments
            WHERE company_id = ?
        `, [company_id]);

        return {
            company: {
                days_schedule: JSON.parse(availability.days_schedule),
                slot_interval: availability.slot_interval,
            },
            appointments,
        };
    }

    // ============ Book Appointment =============
    public async getAllAppointments(): Promise<BookDTO[]> {
        const apps = (await query(`
            SELECT  id,
                    company_id,
                    name,
                    email,
                    phone,
                    date,
                    time,
                    message
            FROM    appointments 
            ORDER BY company_id ASC
        `,));
        return apps;
    }

    public async getOneAppointment(id: number): Promise<BookDTO> {
        const app = (await query(`
            SELECT  id,
                    company_id,
                    name,
                    email,
                    phone,
                    date,
                    time,
                    message
            FROM    appointments 
            WHERE   id = ?
            ORDER BY company_id ASC
        `, [id]))[0];
        return app;
    }

    public async getAllAppsByCompany(companyId: string): Promise<BookDTO[]> {
        const apps = await query(`
            SELECT  id,
                    company_id,
                    name,
                    email,
                    phone,
                    date,
                    time,
                    message
            FROM    appointments 
            WHERE   company_id = ?
            ORDER BY date ASC
        `, [companyId]);

        return apps;
    }

    public async getOneAppByCompany(companyId: string): Promise<BookDTO> {
        const app = (await query(`
            SELECT  id,
                    company_id,
                    name,
                    email,
                    phone,
                    date,
                    time,
                    message
            FROM    appointments 
            WHERE   company_id = ?
        `, [companyId]))[0];
        return app;
    }

    public async addAppointment(app: BookDTO): Promise<BookDTO> {
        const { company_id, name, email, phone, date, time, message } = app;
        const result = await query(`
            INSERT INTO appointments(company_id, name, email, phone, date, time, message)
            VALUES( ?, ?, ?, ?, ?, ?, ?)
            `, [company_id, name, email, phone, date, time, message]);
        const insertId = result.insertId;
        await sendAppointmentConfirmationEmail(email, name, date, time, message);
        return this.getOneAppointment(insertId);
    }

    public async deleteAppointment(id: number): Promise<boolean> {
        const result: OkPacketParams = await query(`
            DELETE FROM appointments
            WHERE       id = ?
        `, [id]);
        return Boolean(result.affectedRows);
    }

}

const appointments = new Appointments();
export default appointments;