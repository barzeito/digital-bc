import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";

class Appointments implements Model {

    public async getAll(): Promise<DTO[]> {
        const apps = (await query(`
            SELECT  a.appId,
                    a.company_id,
                    a.company,
                    a.days_schedule,
                    a.slot_interval,
                    bc.company
            FROM    app_availability a
            LEFT JOIN business_cards bc ON a.company_id = bc.id 
            ORDER BY bc.company ASC
        `,));
        if (apps && typeof apps.days_schedule === 'string') {
            apps.days_schedule = JSON.parse(apps.days_schedule);
        }
        return apps;
    }

    public async getOne(id: string): Promise<DTO> {
        const app = (await query(`
            SELECT  appId,
                    company_id,
                    company,
                    days_schedule,
                    slot_interval
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
                    slot_interval
            FROM    app_availability 
            WHERE   company_id = ?
        `, [id]))[0];

        if (app && typeof app.days_schedule === 'string') {
            app.days_schedule = JSON.parse(app.days_schedule);
        }

        return app;
    }

    public async add(app: DTO): Promise<DTO> {
        const { company_id, company, days_schedule, slot_interval } = app;
        const appId = v4();
        const daysScheduleString = JSON.stringify(days_schedule);
        const addApp: OkPacketParams = await query(`
            INSERT INTO app_availability (appId, company_id, company, days_schedule, slot_interval)
            VALUES (?, ?, ?, ?, ?)
            `, [appId, company_id, company, daysScheduleString, slot_interval]);
        return this.getOne(appId);
    }

    // public async deleteCard(id: string): Promise<boolean> {
    //     const result: OkPacketParams = await query(`
    //         DELETE FROM business_cards
    //         WHERE       id = ?
    //     `, [id]);
    //     return Boolean(result.affectedRows);
    // }

    // public async update(card: DTO): Promise<DTO> {
    //     const { id, company, coverImage, profileImage, name, description, about, email, phone, website, address, ownedBy } = card;
    //     const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    //     await query(`
    //             UPDATE  business_cards
    //             SET     company = ?,
    //                     coverImage = ?,
    //                     profileImage = ?,
    //                     name = ?,
    //                     description = ?,
    //                     about = ?,
    //                     email = ?,
    //                     phone = ?,
    //                     website = ?,
    //                     address = ?,
    //                     updated_at = ?,
    //                     ownedBy = ?
    //             WHERE   id = ?
    //         `, [company, coverImage, profileImage, name, description, about, email, phone, website, address, updated_at, ownedBy || null, id]);
    //     return this.getOneById(id);
    // }
}

const appointments = new Appointments();
export default appointments;