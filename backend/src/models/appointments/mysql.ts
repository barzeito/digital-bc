import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";
import BookDTO from "./bookDTO";
import { sendAppointmentConfirmationEmail, sendAppointmentToCompanyEmail } from "../../utils/emailService";

class Appointments implements Model {

    // ============ Appointments Menage =============
    public async getAllAvailable(): Promise<DTO[]> {
        const apps = (await query(`
            SELECT  a.appId,
                    a.company_id,
                    a.company,
                    a.days_schedule,
                    a.slot_interval,
                    a.appAvailable,
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

    public async getOneAvailable(id: string): Promise<DTO> {
        const app = (await query(`
            SELECT  appId,
                    company_id,
                    company,
                    days_schedule,
                    slot_interval,
                    appAvailable
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
                    appAvailable
            FROM    app_availability 
            WHERE   company_id = ?
        `, [id]))[0];

        if (app && typeof app.days_schedule === 'string') {
            app.days_schedule = JSON.parse(app.days_schedule);
        }

        return app;
    }

    public async addAvailable(app: DTO): Promise<DTO> {
        const { company_id, company, days_schedule, slot_interval, appAvailable } = app;
        const appId = v4();
        const daysScheduleString = JSON.stringify(days_schedule);
        const addApp: OkPacketParams = await query(`
            INSERT INTO app_availability (appId, company_id, company, days_schedule, slot_interval, appAvailable)
            VALUES (?, ?, ?, ?, ?, ?)
            `, [appId, company_id, company, daysScheduleString, slot_interval, appAvailable]);
        return this.getOneAvailable(appId);
    }

    public async updateAvailable(app: DTO): Promise<DTO> {
        const { company_id, company, days_schedule, slot_interval } = app;
        await query(`
                UPDATE  app_availability
                SET     company_id = ?,
                        company = ?,
                        days_schedule = ?,
                        slot_interval = ?,
                WHERE   company_id = ?
            `, [company_id, company, days_schedule, slot_interval, company_id]);
        return this.getOneByCompanyId(company_id);
    }

    public async setAppAvailable(companyId: string, isAvailable: boolean): Promise<any> {
        const result = await query(`
            UPDATE app_availability
            SET    appAvailable = ?
            WHERE  company_id = ?
        `, [isAvailable, companyId]);
        return result;
    }

    public async getAppAvailable(companyId: string): Promise<any> {
        const result = await query(`
            SELECT appAvailable
            FROM   app_availability
            WHERE  company_id = ?
        `, [companyId]);
        return result;
    }


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