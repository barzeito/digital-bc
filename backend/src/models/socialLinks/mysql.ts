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
                    platform,
                    url
            FROM    social_links 
        `,));
        return slinks;
    }

    public async getOne(id: string): Promise<DTO> {
        const slink = (await query(`
            SELECT  id,
                    company_id,
                    company,
                    platform,
                    url
            FROM    social_links  
            WHERE   id = ?
        `, [id]))[0];
        return slink;
    }

    public async add(slink: DTO): Promise<DTO> {
        const { id, company_id, company, platform, url } = slink;
        const addLink: OkPacketParams = await query(`
            INSERT INTO social_links(id, company_id, company, platform, url)
            VALUES(?, ?, ?, ?, ?)
        `, [id, company_id, company, platform, url]);
        return this.getOne(id);
    }

    public async deleteSocial(id: string): Promise<boolean> {
        const result: OkPacketParams = await query(`
            DELETE FROM social_links
            WHERE       id = ?
        `, [id]);
        return Boolean(result.affectedRows);
    }

    public async update(slink: DTO): Promise<DTO> {
        const { id, company, platform, url } = slink;
        await query(`
                UPDATE social_links
                SET    company = ?,
                        platform = ?,
                        url = ?
                WHERE  id = ?
            `, [company, platform, url, id]);
        return this.getOne(id);
    }
}

const social_links = new SocialLinks();
export default social_links;