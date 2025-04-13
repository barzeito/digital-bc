import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";

class SocialLinks implements Model {

    public async getAll(): Promise<DTO[]> {
        const slinks = (await query(`
            SELECT  id,
                    company_id,
                    company,
                    facebook,
                    instagram,
                    linkedin,
                    twitter,
                    whatsapp,
                    email,
                    map,
                    phone,
                    tiktok
            FROM    social_links 
        `,));
        return slinks;
    }

    public async create(social: DTO): Promise<DTO> {
        const { company_id, company, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok } = social;
        const id = v4();
        await query(`
            INSERT INTO social_links (id, company_id, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, company_id, company, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok]);
        return this.getOne(company_id);
    }

    public async getOne(company_id: string): Promise<DTO> {
        const slink = (await query(`
            SELECT  id,
                    company_id,
                    company,
                    facebook,
                    instagram,
                    linkedin,
                    twitter,
                    whatsapp,
                    email,
                    map,
                    phone,
                    tiktok
            FROM    social_links  
            WHERE   company_id = ?
        `, [company_id]))[0];
        return slink;
    }

    public async update(slink: DTO): Promise<DTO> {
        const { company_id, company, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok } = slink;
        await query(`
        UPDATE social_links
        SET    company = ?,
               facebook = ?,
               instagram = ?,
               linkedin = ?,
               twitter = ?,
               whatsapp = ?,
               email = ?,
               map = ?,
               phone = ?,
               tiktok = ?
        WHERE  company_id = ?
    `, [company, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok, company_id]);

        return this.getOne(company_id);
    }
}

const social_links = new SocialLinks();
export default social_links;