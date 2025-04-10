import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";

class BusinessCards implements Model {

    public async getAll(): Promise<DTO[]> {
        const cards = (await query(`
            SELECT  id,
                    company,
                    description,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at
            FROM    business_cards  
            ORDER BY company ASC
        `,));
        return cards;
    }

    public async getOne(company: string): Promise<DTO> {
        const card = (await query(`
            SELECT  id,
                    company,
                    description,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at
            FROM    business_cards  
            WHERE   company = ?
        `, [company]))[0];
        return card;
    }

    public async getOneById(id: string): Promise<DTO> {
        const card = (await query(`
            SELECT  id,
                    company,
                    description,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at
            FROM    business_cards  
            WHERE   id = ?
        `, [id]))[0];
        return card;
    }

    public async add(card: DTO): Promise<DTO> {
        const { company, description, email, phone, website, address, created_at, updated_at } = card;
        const id = v4();
        const addCard: OkPacketParams = await query(`
            INSERT INTO business_cards(id, company, description, email, phone, website, address, created_at, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ? ,?)
        `, [id, company, description, email, phone, website, address, created_at, updated_at]);
        return this.getOneById(id);
    }

    public async deleteCard(id: string): Promise<boolean> {
        const result: OkPacketParams = await query(`
            DELETE FROM business_cards
            WHERE       id = ?
        `, [id]);
        return Boolean(result.affectedRows);
    }

    public async update(card: DTO): Promise<DTO> {
        const { id, company, description, email, phone, website, address } = card;
        const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
        await query(`
                UPDATE  business_cards
                SET     company = ?,
                        description = ?,
                        email = ?,
                        phone = ?,
                        website = ?,
                        address = ?,
                        updated_at = ?
                WHERE   id = ?
            `, [company, description, email, phone, website, address, updated_at, id]);
        const updatedCard = await this.getOneById(id);
        console.log("Updated card:", updatedCard); // לוג
        return this.getOneById(id);
    }
}

const business_cards = new BusinessCards();
export default business_cards;